import { registerRootComponent } from 'expo'
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Text, View, useColorScheme, FlatList, Pressable } from 'react-native'
import { useEffect, useState } from 'react'
import { Analytics, Crash } from './src/analytics'
import { getLastRead, setLastRead } from './src/storage/local'

const Stack = createNativeStackNavigator()

function LibraryScreen({ navigation }: any) {
  const [stories, setStories] = useState<any[]>([])
  useEffect(() => {
    // Local dev content service
    fetch('http://localhost:4001/stories')
      .then((r) => r.json())
      .then(setStories)
      .catch(() => setStories([]))
  }, [])
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              Analytics.track({
                name: 'open_story',
                props: { storyId: item.id }
              })
              navigation.navigate('StoryDetail', { storyId: item.id })
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

function StoryDetailScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Story Detail</Text>
    </View>
  )
}

function ReaderScreen({ route }: any) {
  const { storyId } = route.params ?? {}
  const [last, setLast] = useState<any>(null)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const lr = await getLastRead(storyId)
        if (mounted) setLast(lr)
      } catch (e) {
        Crash.capture(e, { where: 'ReaderScreen.getLastRead' })
      }
    })()
    return () => {
      mounted = false
    }
  }, [storyId])
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
      }}
    >
      <Text>Reader</Text>
      <Text selectable>
        Last read: {last ? `${last.chapterId}#${last.nodeId}` : '—'}
      </Text>
      <Pressable
        onPress={async () => {
          const payload = {
            storyId,
            chapterId: 'ch-1',
            nodeId: 'n-1',
            updatedAt: Date.now()
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
