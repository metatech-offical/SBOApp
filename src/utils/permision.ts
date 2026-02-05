import {Alert, Linking, Platform} from 'react-native';
import {
  request,
  RESULTS,
  checkNotifications,
  requestNotifications,
  openSettings,
  check,
  PERMISSIONS,
} from 'react-native-permissions';

export const Camera = 'Camera';
export const MediaLibrary = 'MediaLibrary';
export const PhotoLibrary = 'PhotoLibrary';
export const Microphone = 'Microphone';

// Notification Permissions
export const requestNotificationPermission = async () => {
  try {
    let permissionGranted = false;

    while (!permissionGranted) {
      const {status} = await checkNotifications();
      if (status === 'granted') {
        console.log('Notification permission already granted');
        return true;
      }
      if (status === 'blocked') {
        console.log('Notification permission blocked');
        showSettingsAlert();
        return false;
      }
      const {status: newStatus} = await requestNotifications([
        'alert',
        'sound',
        'badge',
      ]);
      if (newStatus === 'granted') {
        console.log('Notification permission granted');
        permissionGranted = true;
        return true;
      }
      if (newStatus === 'blocked') {
        console.log('Notification permission blocked after request');
        showSettingsAlert();
        return false;
      }
      console.log('User denied permission, requesting again...');
    }
  } catch (error) {
    console.error(
      'Error checking or requesting notification permission:',
      error,
    );
    return false;
  }
};
export const showSettingsAlert = () => {
  Alert.alert(
    'Enable Notifications',
    'Notifications are disabled. Please enable them in settings to get orders.',
    [
      {
        text: 'Open Settings',
        onPress: () => {
          if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
          } else {
            Linking.openSettings();
          }
        },
      },
    ],
  );
};

// Camera and Galary Permissions
export const CheckPermission = async (permissionType: any) => {
  try {
    const result = await check(permissionType);
    switch (result) {
      case RESULTS.DENIED:
        return requestPermission(permissionType);
      case RESULTS.GRANTED:
        return true;
      case RESULTS.BLOCKED:
        return requestPermission(permissionType);
    }
  } catch (error) {
    return false;
  }
};
export const requestPermission = async (permissionType: any) => {
  let msg = 'Please enable the required permission in your app settings.';
  try {
    const result = await request(permissionType);
    if (result === RESULTS.BLOCKED) {
      openSetting(msg);
      return false;
    } else if (result === RESULTS.DENIED) {
      return false;
    } else if (result === RESULTS.GRANTED) {
      return true;
    }
  } catch (error) {
    return false;
  }
};
export const openSetting = (msg: string) => {
  Alert.alert('Permission Blocked', msg, [
    {
      text: 'Cancel',
      style: 'cancel',
      onPress: () => {},
    },
    {
      text: 'Open Settings',
      onPress: () => openSettings(),
    },
  ]);
};

// Camera and Microphone Permissions
export const CheckCameraPermission = async () => {
  try {
    const cameraPermission = Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.CAMERA 
      : PERMISSIONS.ANDROID.CAMERA;
    
    const result = await check(cameraPermission);
    switch (result) {
      case RESULTS.DENIED:
        return requestPermission(cameraPermission);
      case RESULTS.GRANTED:
        return true;
      case RESULTS.BLOCKED:
        return requestPermission(cameraPermission);
    }
  } catch (error) {
    return false;
  }
};

export const CheckMicrophonePermission = async () => {
  try {
    const microphonePermission = Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.MICROPHONE 
      : PERMISSIONS.ANDROID.RECORD_AUDIO;
    
    const result = await check(microphonePermission);
    switch (result) {
      case RESULTS.DENIED:
        return requestPermission(microphonePermission);
      case RESULTS.GRANTED:
        return true;
      case RESULTS.BLOCKED:
        return requestPermission(microphonePermission);
    }
  } catch (error) {
    return false;
  }
};

export const CheckLiveStreamPermissions = async () => {
  try {
    const cameraPermission = await CheckCameraPermission();
    const microphonePermission = await CheckMicrophonePermission();
    
    if (!cameraPermission) {
      Alert.alert(
        'Camera Permission Required',
        'Camera access is required for live streaming. Please enable camera permission in settings.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => openSettings()},
        ],
      );
      return false;
    }
    
    if (!microphonePermission) {
      Alert.alert(
        'Microphone Permission Required',
        'Microphone access is required for live streaming. Please enable microphone permission in settings.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => openSettings()},
        ],
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking live stream permissions:', error);
    return false;
  }
};
