import { Platform } from 'react-native'
import Constants from 'expo-constants'

const expoHost = Constants.expoConfig?.hostUri?.split(':')?.[0]
const lan = expoHost || 'localhost'

const host = Platform.select({
  ios: lan,
  android: lan === 'localhost' ? '10.0.2.2' : lan,
  default: lan
}) as string

export const API = {
  contentBaseUrl: `http://${host}:4001`,
  progressBaseUrl: `http://${host}:4002`
}

export const DEV_USER_ID = 'user_dev_1'
