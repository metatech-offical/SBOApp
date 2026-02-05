import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import RtmpPublisher from 'react-native-rtmp-publisher';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import CustomButton from '@components/CustomButtons/CustomButton';
import {
  PERMISSIONS,
  request,
  check,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {CrossIcon} from '@assets/svg/AuthFlowIcons';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {LiveIcon} from '@assets/svg/UploadScreensIcon';
import {navigate} from '@navigation/utils';
import {MainStackParamList} from '@navigation/screens';
import {fontSize} from '@constant/fontSize';

const RTMPCamera = () => {
  const navigation = useNavigation();
  const publisherRef = useRef<any>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const cameraPermission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA;

      const cameraResult = await check(cameraPermission);
      console.log('Camera permission status:', cameraResult);

      if (cameraResult === RESULTS.GRANTED) {
        setHasCameraPermission(true);
        return true;
      }

      if (cameraResult === RESULTS.DENIED || cameraResult === RESULTS.BLOCKED) {
        const requestResult = await request(cameraPermission);
        console.log('Permission request result:', requestResult);

        if (requestResult === RESULTS.GRANTED) {
          setHasCameraPermission(true);
          return true;
        } else {
          Alert.alert(
            'Camera Permission Required',
            'This app needs camera access to start live streaming. Please enable camera permission in your device settings.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                  setHasCameraPermission(false);
                },
              },
              {
                text: 'Open Settings',
                onPress: () => {
                  openSettings();
                  setHasCameraPermission(false);
                },
              },
            ],
          );
          setHasCameraPermission(false);
          return false;
        }
      }

      // Handle other permission states
      setHasCameraPermission(false);
      return false;
    } catch (error) {
      console.error('Camera permission error:', error);
      setHasCameraPermission(false);
      return false;
    }
  };

  useEffect(() => {
    const initializePermissions = async () => {
      console.log('Initializing camera permissions...');
      setIsInitializing(true);

      try {
        const hasPermission = await requestCameraPermission();
        console.log('Permission result:', hasPermission);
      } catch (error) {
        console.error('Error initializing permissions:', error);
        setHasCameraPermission(false);
        Alert.alert(
          'Initialization Error',
          'Failed to initialize camera permissions. Please try again.',
          [
            {
              text: 'Retry',
              onPress: () => {
                initializePermissions();
              },
            },
            {text: 'Go Back', onPress: () => navigation.goBack()},
          ],
        );
      } finally {
        setIsInitializing(false);
      }
    };

    initializePermissions();
  }, [navigation]);

  const handleCreateLive = () => {
    navigate('CreatLive', {
      screen: 'CreatLive',
    });
  };

  const handleRetryPermission = async () => {
    setIsInitializing(true);
    await requestCameraPermission();
    setIsInitializing(false);
  };

  // Show loading state
  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Initializing camera...</Text>
      </View>
    );
  }

  // Show permission request state
  if (hasCameraPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to start live streaming
        </Text>
        <CustomButton
          text="Grant Camera Permission"
          onPress={handleRetryPermission}
          btnStyle={styles.permissionButton}
        />
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show main camera interface
  return (
    <View style={styles.container}>
      <RtmpPublisher
        ref={publisherRef}
        style={styles.camera}
        streamURL="rtmp://dummy-url"
        streamName="preview-only"
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}>
          <CrossIcon fill={Colors.white} width={20} height={20} />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          text="Create Live"
          onPress={handleCreateLive}
          btnStyle={styles.createButton}
          textStyle={styles.createButtonText}
          icon={<LiveIcon fill={Colors.black} width={20} height={20} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  createButton: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    height: 45,
    width: '40%',
  },
  createButtonText: {
    color: Colors.black,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  loadingText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
  },
  permissionText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    width: '60%',
    borderRadius: 30,
    backgroundColor: Colors.white,
    height: 45,
    marginBottom: 15,
  },
  goBackButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  goBackText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    textDecorationLine: 'underline',
  },
});

export default RTMPCamera;
