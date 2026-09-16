import {Pressable, StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '@constant/colors';
import {fontSize, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {HomeChevronIcon} from '@assets/svg/HomeScreenIcon';

export default function HomeEmptyRow({
  icon,
  text,
  onPress,
  style,
}: {
  icon: React.ReactNode;
  text: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.row, style]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.12)', 'rgba(198,133,255,0.18)']}
        style={styles.iconBox}>
        {icon}
      </LinearGradient>
      <Text style={styles.text}>{text}</Text>
      <View style={styles.chevron}>
        <HomeChevronIcon />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 95,
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
  },
  chevron: {
    width: wp('5'),
    alignItems: 'flex-end',
  },
});
