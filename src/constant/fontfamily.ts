import {Platform} from 'react-native';

export const fonts = {
  // Poppins Font Family
  'Poppins-Black': Platform.OS === 'ios' ? 'Poppins Black' : 'Poppins-Black',
  'Poppins-BlackItalic':
    Platform.OS === 'ios' ? 'Poppins BlackItalic' : 'Poppins-BlackItalic',
  'Poppins-Bold': Platform.OS === 'ios' ? 'Poppins Bold' : 'Poppins-Bold',
  'Poppins-BoldItalic':
    Platform.OS === 'ios' ? 'Poppins BoldItalic' : 'Poppins-BoldItalic',
  'Poppins-ExtraBold':
    Platform.OS === 'ios' ? 'Poppins ExtraBold' : 'Poppins-ExtraBold',
  'Poppins-ExtraBoldItalic':
    Platform.OS === 'ios'
      ? 'Poppins ExtraBoldItalic'
      : 'Poppins-ExtraBoldItalic',
  'Poppins-ExtraLight':
    Platform.OS === 'ios' ? 'Poppins ExtraLight' : 'Poppins-ExtraLight',
  'Poppins-ExtraLightItalic':
    Platform.OS === 'ios'
      ? 'Poppins ExtraLightItalic'
      : 'Poppins-ExtraLightItalic',
  'Poppins-Italic': Platform.OS === 'ios' ? 'Poppins Italic' : 'Poppins-Italic',
  'Poppins-Light': Platform.OS === 'ios' ? 'Poppins Light' : 'Poppins-Light',
  'Poppins-LightItalic':
    Platform.OS === 'ios' ? 'Poppins LightItalic' : 'Poppins-LightItalic',
  'Poppins-Medium': Platform.OS === 'ios' ? 'Poppins Medium' : 'Poppins-Medium',
  'Poppins-MediumItalic':
    Platform.OS === 'ios' ? 'Poppins MediumItalic' : 'Poppins-MediumItalic',
  'Poppins-Regular':
    Platform.OS === 'ios' ? 'Poppins Regular' : 'Poppins-Regular',
  'Poppins-SemiBold':
    Platform.OS === 'ios' ? 'Poppins SemiBold' : 'Poppins-SemiBold',
  'Poppins-SemiBoldItalic':
    Platform.OS === 'ios' ? 'Poppins SemiBoldItalic' : 'Poppins-SemiBoldItalic',
  'Poppins-Thin': Platform.OS === 'ios' ? 'Poppins Thin' : 'Poppins-Thin',
  'Poppins-ThinItalic':
    Platform.OS === 'ios' ? 'Poppins ThinItalic' : 'Poppins-ThinItalic',
};
