import React from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {PlusIcon} from '@assets/svg/CommonIcons';
import {
  ShortsClockIcon,
  ShortsPlayBadgeIcon,
  ShortsVolumeIcon,
} from '@assets/svg/ShortsIcon';
import {RootState, useAppSelector} from '@store/index';
import {getTimeDifference, videoTimeDuration} from '@utils/general';

type ShortsFeedCardProps = {
  item: any;
  onPress: () => void;
  onFollow: () => void;
  onOptionsPress: () => void;
  onProfilePress: () => void;
};

const ShortsFeedCard = ({
  item,
  onPress,
  onFollow,
  onOptionsPress,
  onProfilePress,
}: ShortsFeedCardProps) => {
  const {user} = useAppSelector((state: RootState) => state.user);
  const username =
    item?.creator?.username || item?.creator?.userName || item?.username || '';
  const displayName =
    item?.creator?.displayName || username || item?.creator?.userName || '';
  const tags = item?.tags || [];
  const duration = item?.duration || item?.videoDuration || 0;
  const createdAt = item?.createdAt;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Pressable onPress={onProfilePress} style={styles.userRow}>
          <FastImage
            source={
              item?.creator?.profilePicture
                ? {uri: item.creator.profilePicture}
                : require('@assets/images/DummyUserImage.png')
            }
            style={styles.avatar}
          />
          <View style={styles.userText}>
            <Text numberOfLines={1} style={styles.displayName}>
              {displayName}
            </Text>
            <Text numberOfLines={1} style={styles.handle}>
              @{username}
              {createdAt ? `  •  ${getTimeDifference(createdAt)}` : ''}
            </Text>
          </View>
        </Pressable>
        <View style={styles.headerActions}>
          {item?.creator?._id !== user?._id && (
            <Pressable onPress={onFollow} style={styles.followButton}>
              {!item?.isFollowing && (
                <PlusIcon width={8} height={8} fill={Colors.white} />
              )}
              <Text style={styles.followText}>
                {item?.isFollowing ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          )}
          <Pressable onPress={onOptionsPress} hitSlop={12}>
            <Image
              source={require('@assets/images/optionIcon.png')}
              style={styles.optionIcon}
              tintColor={Colors.white}
            />
          </Pressable>
        </View>
      </View>

      <Pressable onPress={onPress} style={styles.preview}>
        <View style={styles.previewFrame}>
          <FastImage
            source={{uri: item?.thumbnailUrl || ''}}
            style={styles.portraitThumb}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.portraitScrim} />
        </View>
        <View style={styles.playBadge}>
          <ShortsPlayBadgeIcon />
        </View>
        <View style={styles.durationBadge}>
          <ShortsClockIcon width={10} height={10} />
          <Text style={styles.durationText}>
            {videoTimeDuration(duration || 0)}
          </Text>
        </View>
        <View style={styles.volumeButton}>
          <ShortsVolumeIcon width={14} height={14} />
        </View>
      </Pressable>

      {!!(item?.title || item?.description) && (
        <Text numberOfLines={2} style={styles.title}>
          {item?.title || item?.description}
        </Text>
      )}

      {tags.length > 0 && (
        <View style={styles.tagsRow}>
          {tags.map((tag: string, index: number) => (
            <View key={`${tag}-${index}`} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ShortsFeedCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F0F0F0',
  },
  userText: {
    flex: 1,
    marginLeft: 10,
  },
  displayName: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    includeFontPadding: false,
  },
  handle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    marginTop: 2,
    includeFontPadding: false,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    height: 25,
    minWidth: 69,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  followText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    includeFontPadding: false,
  },
  optionIcon: {
    height: 24,
    width: 12,
    marginLeft: 12,
  },
  preview: {
    height: 210,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewFrame: {
    width: '35%',
    height: '100%',
    overflow: 'hidden',
  },
  portraitThumb: {
    width: '100%',
    height: '100%',
  },
  portraitScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(129,129,129,0.2)',
  },
  playBadge: {
    position: 'absolute',
    top: 10,
    left: 12,
    width: 19,
    height: 14,
    borderRadius: 3,
    backgroundColor: '#FF2C35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    top: 8,
    right: 12,
    height: 18,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(36,35,35,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    color: '#FAFAFA',
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
    includeFontPadding: false,
  },
  volumeButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(36,35,35,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.white,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    marginTop: 12,
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  tag: {
    height: 23,
    paddingHorizontal: 10,
    borderRadius: 11.5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: '#EEEEEE',
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
    includeFontPadding: false,
  },
});
