import {LogBox, StyleSheet, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {useNetInfo} from '@react-native-community/netinfo';
import {requestNotificationPermission} from '@utils/permision';
import {store} from '@store/index';
import Application from '@navigation/index';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import {socketService} from '@socket/index';
import StreamListener from '@hooks/streamListiner';
import {ToastProvider} from 'react-native-toast-notifications';

const App = () => {
  const {isConnected} = useNetInfo();

  useEffect(() => {
    messaging().registerDeviceForRemoteMessages();
  }, []);

  useEffect(() => {
    socketService();
    LogBox.ignoreAllLogs();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (isConnected === false) {
      Alert.alert('No Internet Connection', 'Please check your connection.');
    }
  }, [isConnected]);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <Provider store={store}>
          <StreamListener />
          <ToastProvider>
            <Application />
          </ToastProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({});
