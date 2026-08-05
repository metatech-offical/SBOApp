import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {fonts} from '@constant/fontfamily';
import FastImage from 'react-native-fast-image';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

interface SettingHeaderProps {
  title: string;
  onBackPress: () => void;
  showSave?: boolean;
  onSavePress?: () => void;
}

const SettingHeader = ({
  title,
  onBackPress,
  showSave,
  onSavePress,
}: SettingHeaderProps) => {
  const {top} = useSafeAreaInsets();
  return (
    <View style={[styles.container, {marginTop: top}]}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.icon}
          hitSlop={20}>
          <BackArrow
            color={Colors.white}
            height={20}
            width={20}
            opacity={0.5}
          />
        </TouchableOpacity>
        <Text style={[styles.textStyle]}>{title}</Text>
      </View>
      {showSave ? (
        <TouchableOpacity
          hitSlop={20}
          style={styles.saveButton}
          onPress={onSavePress}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <FastImage
          source={require('@assets/images/appLogo2.png')}
          style={styles.logo}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}
    </View>
  );
};

export default SettingHeader;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: fontSize.f18,
    alignSelf: 'center',
    marginLeft: 20,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 40,
    width: 40,
  },
  saveButton: {
    paddingHorizontal: 15,
  },
  saveText: {
    color: '#D13C50',
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
  },
});
