import { NitroModules } from 'react-native-nitro-modules'
import type { StartIoSdk as StartIoSdkSpec } from './specs/start-io-sdk.nitro'

export const StartIoSdk =
  NitroModules.createHybridObject<StartIoSdkSpec>('StartIoSdk')