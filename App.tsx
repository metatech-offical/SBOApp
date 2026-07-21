import {LogBox, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {useNetInfo} from '@react-native-community/netinfo';
import {StripeProvider} from '@stripe/stripe-react-native';
import {STRIPE_PUBLISHABLE_KEY} from '@env';
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
        <StripeProvider
          publishableKey={STRIPE_PUBLISHABLE_KEY || ''}
          urlScheme="sbo"
          merchantIdentifier="merchant.ai.metastart.sbo">
          <Provider store={store}>
            <StreamListener />
            <ToastProvider>
              <Application />
            </ToastProvider>
          </Provider>
        </StripeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
