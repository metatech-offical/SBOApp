import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
import FastImage from 'react-native-fast-image';
import {fonts} from '@constant/fontfamily';
import {LikeIcon, UnLikeIcon} from '@assets/svg/ShortsIcon';
import {Colors} from '@constant/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {fontSize} from '@constant/fontSize';

interface ProfileHeaderProps {
  onBackPress: () => void;
  style?: any;
  onLikePress?: () => void;
  likeCount?: number;
  title?: string;
  isLikeVisible?: boolean;
  isSemiboldtitle?: boolean;
}

const TicketingHeader = ({
  onBackPress,
  style,
  onLikePress,
  likeCount = 100,
  title = 'Book tickets',
  isLikeVisible = true,
  isSemiboldtitle=false
}: ProfileHeaderProps) => {
  const {top} = useSafeAreaInsets();
  return (
    <View style={[styles.container, {marginTop: top}, style]}>
      <View style={styles.row}>
        <TouchableOpacity
          hitSlop={20}
          onPress={onBackPress}
          style={styles.icon}>
          <BackArrow color={'#FFFFFF43'} height={16} width={16} />
          <Text style={isSemiboldtitle ? styles.semiboldtext : styles.text}>{title}</Text>
        </TouchableOpacity>
        {isLikeVisible && (
          <View style={styles.likeContainer}>
            {/* <TouchableOpacity onPress={onLikePress}>
              <UnLikeIcon
                fill={Colors.white}
                stroke={Colors.white}
                height={16}
                width={16}
              />
            </TouchableOpacity>
            <Text style={styles.text}>{likeCount}</Text> */}
          </View>
        )}
      </View>
    </View>
  );
};

export default TicketingHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    columnGap: 10,
  },
  text: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
 semiboldtext: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
});
