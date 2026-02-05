/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './src/translation';
import messaging from '@react-native-firebase/messaging';
import {createChannels, onMessageReceived} from '@utils/configNotification';
import {setHasNotifications} from '@store/NotificationManager';
import {store} from '@store/index';

createChannels();
messaging().setBackgroundMessageHandler(async remoteMessage => {
  onMessageReceived(remoteMessage?.notification);
  store.dispatch(setHasNotifications(true));
});
AppRegistry.registerComponent(appName, () => App);
