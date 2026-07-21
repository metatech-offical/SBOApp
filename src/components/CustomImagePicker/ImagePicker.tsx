import {Platform, View} from 'react-native';
import React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-action-sheet';
import {PERMISSIONS} from 'react-native-permissions';
import {CheckPermission} from '@utils/permision';

const aspectRatio = {
  shorts: {
    widthRatio: 9,
    heightRatio: 16,
  },
  video: {
    widthRatio: 16,
    heightRatio: 9,
  },
};

// 🔧 Helper to calculate dynamic resolution
const getResolution = (screenType: string) => {
  const {widthRatio, heightRatio} = aspectRatio[
    screenType as keyof typeof aspectRatio
  ] || {
    widthRatio: 1,
    heightRatio: 1,
  };

  // Example base width
  const baseWidth = 1080; // You can also use Dimensions.get('window').width * some factor
  const baseHeight = Math.round((baseWidth * heightRatio) / widthRatio);

  return {width: baseWidth, height: baseHeight};
};

const CustomImagePicker = ({
  selectedValue,
  selectedCancel,
  multiple,
  type,
  screenType,
}: any) => {
  const OpenActionSheet: any = () => {
    ActionSheet.showActionSheetWithOptions(
      {
        options: ['Select Camera', 'Select Gallery', 'Cancel'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
        tintColor: 'blue',
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          if (Platform.OS === 'ios') {
            CheckPermission(PERMISSIONS.IOS.PHOTO_LIBRARY).then(val => {
              if (val) cammeraImage();
            });
          } else {
            cammeraImage();
          }
        } else if (buttonIndex === 1) {
          if (Platform.OS === 'ios') {
            CheckPermission(PERMISSIONS.IOS.PHOTO_LIBRARY).then(val => {
              if (val) galleryImage();
            });
          } else {
            galleryImage();
          }
        } else {
          selectedCancel(null);
        }
      },
    );
  };

  const galleryImage = async () => {
    try {
      const {width, height} = getResolution(screenType);

      const imageResult = await ImagePicker.openPicker({
        cropping: !multiple,
        multiple: !!multiple,
        freeStyleCropEnabled: false,
        width,
        height,
        compressImageQuality: 0.85,
      });

      selectedType(imageResult);
    } catch (err) {
      console.log('err', err);
      selectedCancel(null);
    }
  };

  const cammeraImage = async () => {
    try {
      const {width, height} = getResolution(screenType);

      const imageResult = await ImagePicker.openCamera({
        cropping: !multiple,
        multiple: !!multiple,
        freeStyleCropEnabled: false,
        width,
        height,
        compressImageQuality: 0.85,
        mediaType: 'photo',
      });

      selectedType(imageResult);
    } catch (err) {
      selectedCancel(null);
    }
  };

  const selectedType = (item: any) => {
    selectedValue(item);
  };

  return <View>{<OpenActionSheet />}</View>;
};

export default CustomImagePicker;
