import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { Colors } from '@constant/colors';

interface ProfileHeaderProps {
  onBackPress: () => void;
  style?: any;
  onSettingsPress?: () => void;
  Icon?: any;
}

const ProfileHeader = ({
  onBackPress,
  style,
  onSettingsPress,
  Icon,
}: ProfileHeaderProps) => {
  const {top} = useSafeAreaInsets();
  return (
    <View style={[styles.container, {marginTop: top}, style]}>
      <View style={styles.row}>
        <TouchableOpacity onPress={onBackPress} style={styles.icon} hitSlop={20}>
          <BackArrow color={Colors.white} height={20} width={20} />
          <FastImage
            source={require('@assets/images/appLogo2.png')}
            style={styles.logo}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={10} onPress={onSettingsPress}>
          {Icon ? (
            Icon
          ) : (
            <FastImage
              source={require('@assets/images/SettingsIcon.png')}
              style={styles.cartIcon}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    columnGap: 10,
  },
  logo: {
    height: 40,
    width: 40,
  },
  cartIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
});
