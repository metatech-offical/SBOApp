import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fonts} from '@constant/fontfamily';
import {ArrowDown, BackArrow} from '@assets/svg/AuthFlowIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const StackHeader: React.FC<StackHeadersProps> = ({
  title,
  onBackPress,
  style,
  titleStyle,
  rightIcon,
  onRightPress,
  rightIconText,
  icon,
  rightIconStyle,
  showArrowDown = true,
  rightIconTextStyle,
  iconStyle,
}) => {
  const {top} = useSafeAreaInsets();
  return (
    <View style={[styles.container, {marginTop: top}, style]}>
      <View style={[styles.row, iconStyle]}>
        <TouchableOpacity
          hitSlop={20}
          onPress={onBackPress}
          style={styles.icon}>
          <BackArrow
            color={Colors.white}
            height={20}
            width={20}
            opacity={0.5}
            hitSlop={20}
          />
        </TouchableOpacity>
        <Text numberOfLines={1} style={[styles.textStyle, titleStyle]}>
          {title}
        </Text>
      </View>
      {rightIcon && (
        <TouchableOpacity
          hitSlop={20}
          style={[styles.rightIcon, rightIconStyle]}
          onPress={onRightPress}>
          {icon && icon}
          {rightIconText?.length && (
            <Text style={[styles.rightIconText, rightIconTextStyle]}>
              {rightIconText}
            </Text>
          )}
          {showArrowDown && <ArrowDown color={Colors.white} />}
        </TouchableOpacity>
      )}
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
    paddingRight: 20,
    marginTop: 10,
    marginBottom: 10,
    zIndex: 99,
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
    width: '70%',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  rightIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    minHeight: 40,
    minWidth: 85,
    backgroundColor: '#FFFFFF1A',
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    flexDirection: 'row',
    columnGap: 5,
    marginRight: 10,
  },
});

export default StackHeader;
