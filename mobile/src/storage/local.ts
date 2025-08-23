import AsyncStorage from '@react-native-async-storage/async-storage'

// Simple, typed helpers for bookmarks and last-read state
export type LastRead = {
  storyId: string
  chapterId: string
  nodeId: string
  updatedAt: number
}

const keys = {
  lastRead: (storyId: string) => `sp:lastRead:${storyId}`,
  bookmark: (storyId: string, bookmarkId: string) =>
    `sp:bookmark:${storyId}:${bookmarkId}`
}

export async function setLastRead(state: LastRead) {
  await AsyncStorage.setItem(
    keys.lastRead(state.storyId),
    JSON.stringify(state)
  )
}

export async function getLastRead(storyId: string): Promise<LastRead | null> {
  const raw = await AsyncStorage.getItem(keys.lastRead(storyId))
  return raw ? JSON.parse(raw) : null
}

export async function setBookmark(
  storyId: string,
  bookmarkId: string,
  payload: any
) {
  await AsyncStorage.setItem(
    keys.bookmark(storyId, bookmarkId),
    JSON.stringify({ ...payload, savedAt: Date.now() })
  )
}

export async function removeBookmark(storyId: string, bookmarkId: string) {
  await AsyncStorage.removeItem(keys.bookmark(storyId, bookmarkId))
}
