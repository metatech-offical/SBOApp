import {BackArrow} from '@assets/svg/AuthFlowIcons';
import { Colors } from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import { fontSize } from '@constant/fontSize';
import React, {useMemo} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const AuthHeader: React.FC<StackHeaderProps> = ({
  title,
  onBackPress,
  style,
  titleStyle,
  subtitle,
  onTextPress,
}) => {
  const {top} = useSafeAreaInsets();
  return (
    <View style={[styles.container, {marginTop: top}, style]}>
      <TouchableOpacity onPress={onBackPress} hitSlop={20}>
        <BackArrow color={Colors.black} />
      </TouchableOpacity>
      <Pressable onPress={onTextPress}>
        <Text style={[styles.textStyle, titleStyle]}>
          {title}
          <Text style={styles.subTitleStyle}>{subtitle}</Text>
        </Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  textStyle: {
    fontSize: fontSize.f14,
    color: Colors.grey,
    alignSelf: 'center',
    fontFamily: fonts['Poppins-Medium'],
  },
  subTitleStyle: {
    color: '#BA8AEA',
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
  },
});

export default AuthHeader;
