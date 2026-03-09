import Reactotron from 'reactotron-react-native';
import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const scriptURL = NativeModules?.SourceCode?.scriptURL || '';
let host = 'localhost';
try {
  if (scriptURL) {
    host = scriptURL.split('://')[1].split(':')[0];
  }
} catch {}

const tron = Reactotron.configure({ name: 'Driver 1-1', host })
  .setAsyncStorageHandler(AsyncStorage)
  .useReactNative({
    networking: true,
    asyncStorage: true,
    overlay: true,
  })
  .connect()
  .clear();

console.tron = tron;

export default tron;
