import {Dimensions} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as WP,
  heightPercentageToDP as HP,
} from 'react-native-responsive-screen';
export const {width, height} = Dimensions.get('screen');
export const fSize = (size: number) => {
  return RFPercentage(size);
};
export const hp = (val: string) => {
  return HP(val);
};
export const wp = (val: string) => {
  return WP(val);
};
export const fontSize = {
  f5: fSize(0.7),
  f8: fSize(1),
  FM: fSize(1.2),
  f9: fSize(1.3),
  f10: fSize(1.4),
  f12: fSize(1.6),
  f13: fSize(1.7),
  f14: fSize(1.8),
  f16: fSize(2),
  f18: fSize(2.3),
  f20: fSize(2.5),
  f22: fSize(2.8),
  f24: fSize(3),
  f26: fSize(3.3),
  f28: fSize(3.5),
  f30: fSize(3.8),
  f32: fSize(4),
  f34: fSize(4.3),
  f36: fSize(4.5),
  f38: fSize(4.8),
  f40: fSize(5),
  f42: fSize(5.3),
  f44: fSize(5.5),
  f46: fSize(5.8),
  f48: fSize(6),
  f50: fSize(6.3),
};
