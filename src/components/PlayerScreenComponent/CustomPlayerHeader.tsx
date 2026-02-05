import React, {useCallback} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {fonts} from '@constant/fontfamily';
import {formatTime} from '@utils/general';
import {useAppSelector} from '@store/index';
import {RootState} from '@store/index';
import {BackArrow, EyeShowIcon} from '@assets/svg/AuthFlowIcons';
import {VideoIcon} from '@assets/svg/HomeScreenIcon';
import {Colors} from '@constant/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import {fontSize} from '@constant/fontSize';

const CustomPlayerHeader = ({
  navigation,
  CreatorData,
  streamDetail,
  isFollowing,
  selectedUrl,
  handleFollow,
  handleSetting,
  LiveHeader,
  watchCount,
  type,
  showSettingIcon = false,
}: CustomPlayerHeaderProps) => {
  const isLive = LiveHeader
    ? streamDetail?.isLive
    : streamDetail?.stream?.isLive;
  const user = useAppSelector((state: RootState) => state.user);
  const {top} = useSafeAreaInsets();
  const RenderTimer = useCallback(
    ({customStyles}: any) => {
      return (
        <View style={[styles.timerView, customStyles]}>
          <Text style={styles.lengthCount}>
            {streamDetail?.data?.type === 'video'
              ? formatTime(streamDetail?.data?.duration) ?? '00:00'
              : formatTime(streamDetail?.stream?.videoLength) ?? '00:00'}
          </Text>
        </View>
      );
    },
    [styles],
  );
  return (
    <View style={[styles.overlay, type === 'normal' ? {} : {marginTop: top}]}>
      <View>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity hitSlop={20} onPress={() => navigation.goBack()}>
              <BackArrow fill={Colors.white} height={20} width={20} />
            </TouchableOpacity>
            <Pressable
              onPress={() => {
                navigation.navigate('OtherUserProfile', {
                  userId: CreatorData?._id,
                });
              }}
              style={styles.userInfoContainer}>
              {CreatorData?.profilePicture ? (
                <FastImage
                  source={{uri: CreatorData?.profilePicture || ''}}
                  style={styles.profileImage}
                />
              ) : (
                <FastImage
                  source={require('../../assets/images/DummyUserImage.png')}
                  style={styles.avatar1}
                />
              )}
              <View style={styles.nameAndFollowContainer}>
                <Text
                  numberOfLines={1}
                  style={styles.userNameStyle}
                  ellipsizeMode="tail">
                  {(CreatorData?.username || '').slice(0, 20)}
                </Text>
                {CreatorData?._id !== user?.user?._id && (
                  <Pressable
                    onPress={handleFollow}
                    hitSlop={30}
                    style={
                      isFollowing ? styles.followingButton : styles.followButton
                    }>
                    <Text
                      style={
                        isFollowing ? styles.followingText : styles.followText
                      }>
                      {isFollowing ? 'Following' : 'Follow'}
                    </Text>
                  </Pressable>
                )}
              </View>
            </Pressable>
          </View>
          {isLive ? (
            <View style={styles.flex}>
              <View style={styles.watchCountContainer}>
                <EyeShowIcon height={17} width={17} fill={Colors.white} />
                <Text style={styles.viewCount}>
                  {Math.max((watchCount || 0) - 2, 0)}
                </Text>
              </View>
              <View style={styles.liveIndicator}>
                <VideoIcon height={17} width={17} fill={Colors.white} />
              </View>
            </View>
          ) : (
            <RenderTimer />
          )}
        </View>
        {showSettingIcon && (
          <View style={styles.settingWrapper}>
            <Pressable
              hitSlop={40}
              style={styles.settingIconContainer}
              onPress={handleSetting}>
              <FastImage
                source={require('@assets/images/newSettingIcon.png')}
                style={styles.sheetItemImage}
              />
            </Pressable>
          </View>
        )}
      </View>
      {/* {isLive && (
        <RenderTimer customStyles={{alignSelf: 'flex-end', marginRight: 10}} />
      )} */}
    </View>
  );
};
export default CustomPlayerHeader;
const styles = StyleSheet.create({
  overlay: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  leftIcon: {
    height: 21,
    width: 21,
    resizeMode: 'contain',
    marginRight: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  nameAndFollowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  profileImage: {
    height: 35,
    width: 35,
    borderRadius: 17.5,
    marginRight: 8,
  },
  avatar1: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 8,
  },
  userNameStyle: {
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f14,
    marginRight: 4,
    minWidth: 0,
  },
  followingButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.white,
    minWidth: 60,
    alignItems: 'center',
    marginLeft: 10,
  },
  followingText: {
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f12,
  },
  followButton: {
    backgroundColor: Colors.white,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
    marginLeft: 10,
  },
  followText: {
    color: Colors.black,
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f12,
  },
  settingWrapper: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  settingIconContainer: {
    marginTop: 50,
  },
  shareIconContainer: {
    position: 'absolute',
    top: 50,
    right: 15,
  },
  vrBadgeContainer: {
    position: 'absolute',
    top: 90,
    right: 15,
    backgroundColor: Colors.white,
    width: 35,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vrBadgeText: {
    color: Colors.black,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
  },
  sheetItemImage: {
    width: 21,
    height: 21,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCount: {
    fontFamily: fonts['Poppins-Regular'],
    marginLeft: 7,
    fontSize: fontSize.f10,
    color: Colors.white,
  },
  vrIcon: {
    height: 12,
    width: 16,
    marginLeft: 10,
  },
  timerView: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    minWidth: 60,
  },
  lengthCount: {
    fontFamily: fonts['Poppins-Bold'],
    fontSize: fontSize.f12,
    color: Colors.white,
  },
  watchCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIndicator: {
    padding: 2,
    backgroundColor: Colors.red,
    borderRadius: 4,
    marginLeft: 10,
  },
});
