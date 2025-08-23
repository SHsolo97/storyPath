import { registerRootComponent } from 'expo'
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { type FC } from 'react'
import { Text, View, useColorScheme, FlatList, Pressable } from 'react-native'
import { useEffect, useState } from 'react'
import { Analytics, Crash } from './src/analytics'
import { API, DEV_USER_ID } from './src/config/env'
import {
  step as sampleStep,
  type State as ReaderState,
  type SampleStory as StoryDetail,
  findChapter as sampleFindChapter
} from './src/reader/sampleInterpreter'
import { getLastRead, setLastRead } from './src/storage/local'

type Story = { id: string; title: string; description?: string }

type RootStackParamList = {
  Library: undefined
  StoryDetail: undefined
  Reader: { storyId: string }
}
const Stack = createNativeStackNavigator<RootStackParamList>()

function LibraryScreen({ navigation }: { navigation: any }) {
  const [stories, setStories] = useState<Story[]>([])
  useEffect(() => {
    // Local dev content service (host-resolved via Expo env config)
    fetch(`${API.contentBaseUrl}/stories`)
      .then((r) => r.json())
      .then(setStories)
      .catch(() => setStories([]))
  }, [])
  return (
    <View style={{ flex: 1 }}>
      <FlatList<Story>
        data={stories}
        keyExtractor={(item: Story) => item.id}
        renderItem={({ item }: { item: Story }) => (
          <Pressable
            onPress={() => {
              Analytics.track({
                name: 'open_story',
                props: { storyId: item.id }
              })
              navigation.navigate('Reader', { storyId: item.id })
            }}
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#333'
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600' }}>
              {item.title}
            </Text>
            {item.description ? (
              <Text style={{ opacity: 0.8 }}>{item.description}</Text>
            ) : null}
          </Pressable>
        )}
      />
    </View>
  )
}

function StoryDetailScreen(): JSX.Element {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Story Detail</Text>
    </View>
  )
}

type ReaderProps = { route: { params: { storyId: string } } }
function ReaderScreen({ route }: ReaderProps) {
  const { storyId } = route.params
  const [last, setLast] = useState<{
    chapterId: string
    nodeId: string
  } | null>(null)
  const [story, setStory] = useState<StoryDetail | null>(null)
  const [state, setState] = useState<ReaderState | null>(null)
  const [node, setNode] = useState<any>(null)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [lr, s] = await Promise.all([
          getLastRead(storyId),
          fetch(`${API.contentBaseUrl}/stories/${storyId}`).then((r) =>
            r.json()
          )
        ])
        if (!mounted) return
        setStory(s)
        if (mounted) setLast(lr)
        // Try server progress if no local state
        let serverState: any = null
        try {
          const resp = await fetch(
            `${API.progressBaseUrl}/progress/${DEV_USER_ID}/${storyId}`
          )
          if (resp.ok) serverState = await resp.json()
        } catch {}
        const base =
          lr ||
          (serverState
            ? {
                chapterId: serverState.chapterId,
                nodeId: serverState.nodeId,
                variables: serverState.variables
              }
            : null)
        const initial: ReaderState = base
          ? {
              chapterId: base.chapterId,
              nodeId: base.nodeId,
              variables: (base as any).variables ?? {}
            }
          : {
              chapterId: s.chapters?.[0]?.id ?? 'ch-1',
              nodeId: s.chapters?.[0]?.nodes?.[0]?.id ?? 'n-1',
              variables: {}
            }
        setState(initial)
        const firstChapter = s.chapters?.find(
          (c: any) => c.id === initial.chapterId
        )
        const firstNode = firstChapter?.nodes?.find(
          (n: any) => n.id === initial.nodeId
        )
        setNode(firstNode ?? null)
      } catch (e) {
        Crash.capture(e, { where: 'ReaderScreen.getLastRead' })
      }
    })()
    return () => {
      mounted = false
    }
  }, [storyId])
  const onChoose = (choiceId?: string) => {
    if (!story || !state) return
    const next = sampleStep(story as any, state, choiceId)
    if (!next) return
    setState(next)
    const ch = sampleFindChapter(story as any, next.chapterId)
    const nn = ch?.nodes?.find((n: any) => n.id === next.nodeId)
    setNode(nn ?? null)
  }
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
      }}
    >
      <Text style={{ fontWeight: '600' }}>{story?.title ?? 'Reader'}</Text>
      <Text selectable>
        Last read: {last ? `${last.chapterId}#${last.nodeId}` : '—'}
      </Text>
      {node?.image ? (
        <Text style={{ padding: 12, textAlign: 'center' }}>
          [Image] {String(node.image).split('/').pop()}
        </Text>
      ) : null}
      {node?.speaker || node?.text ? (
        <Text style={{ padding: 12, textAlign: 'center' }}>
          {node?.speaker ? `${node.speaker}: ` : ''}
          {node?.text ?? ''}
        </Text>
      ) : null}
      {(node?.choices ?? []).map((c: any) => (
        <Pressable
          key={c.id}
          onPress={() => {
            onChoose(c.id)
            Analytics.track({
              name: 'choice_selected',
              props: { storyId, choiceId: c.id }
            })
          }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderRadius: 6
          }}
        >
          <Text>{c.text}</Text>
        </Pressable>
      ))}
      {!node?.choices || node?.choices.length === 0 ? (
        <Pressable
          onPress={() => onChoose(undefined)}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderRadius: 6
          }}
        >
          <Text>Next</Text>
        </Pressable>
      ) : null}
      <Pressable
        onPress={async () => {
          if (!state) return
          const payload = {
            storyId,
            chapterId: state.chapterId,
            nodeId: state.nodeId,
            updatedAt: Date.now(),
            variables: state.variables
          }
          await setLastRead(payload)
          setLast(payload)
          Analytics.track({ name: 'save_last_read', props: { storyId } })
        }}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderWidth: 1,
          borderRadius: 6
        }}
      >
        <Text>Save last read</Text>
      </Pressable>
      <Pressable
        onPress={async () => {
          if (!state) return
          try {
            await fetch(`${API.progressBaseUrl}/progress`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: DEV_USER_ID,
                storyId,
                chapterId: state.chapterId,
                nodeId: state.nodeId,
                variables: state.variables
              })
            })
            Analytics.track({
              name: 'progress_saved_server',
              props: { storyId }
            })
          } catch (e) {
            Crash.capture(e as any, { where: 'ReaderScreen.saveServer' })
          }
        }}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderWidth: 1,
          borderRadius: 6
        }}
      >
        <Text>Save to server</Text>
      </Pressable>
    </View>
  )
}

export default function App() {
  const scheme = useColorScheme()
  useEffect(() => {
    const env = __DEV__ ? 'dev' : 'prod'
    Analytics.init(env as any)
    Crash.init(env as any)
  }, [])
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Library" component={LibraryScreen} />
        <Stack.Screen name="StoryDetail" component={StoryDetailScreen} />
        <Stack.Screen name="Reader" component={ReaderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

registerRootComponent(App)
