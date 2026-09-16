import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ViewIcon, MoreIcon, PlusIcon} from '@assets/svg/CommonIcons';
import {ShortsVolumeIcon} from '@assets/svg/ShortsIcon';
import {fonts} from '@constant/fontfamily';
import {formatCount} from '@utils/helper';
import {getTimeDifference} from '@utils/general';
import {isDummyReelId} from '@utils/dummyVideos';
import {RootState, useAppSelector} from '@store/index';

type ProfileLiveCardProps = {
  item: any;
  onPress: () => void;
  onFollow?: () => void;
};

const ProfileLiveCard = ({item, onPress, onFollow}: ProfileLiveCardProps) => {
  const {user} = useAppSelector((state: RootState) => state.user);
  const creator = item?.creator || {};
  const name = creator.displayName || creator.username || 'Live';
  const username = creator.username ? `@${creator.username}` : '';
  const showFollow =
    !!creator._id && creator._id !== user?._id && !isDummyReelId(item?._id);
  const isVR = item?.isVR || item?.type === 'vr';

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.identity}>
          <FastImage
            source={
              creator.profilePicture
                ? {uri: creator.profilePicture}
                : require('@assets/images/DummyUserImage.png')
            }
            style={styles.avatar}
          />
          <View style={styles.identityText}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <View style={styles.metaRow}>
              {!!username && (
                <Text style={styles.username} numberOfLines={1}>
                  {username}
                </Text>
              )}
              {!!username && <View style={styles.dot} />}
              <Text style={styles.time}>
                {item?.createdAt ? getTimeDifference(item.createdAt) : 'Live'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          {showFollow && (
            <Pressable onPress={onFollow} style={styles.followButton}>
              <PlusIcon width={14} height={14} fill="#FFFFFF" />
              <Text style={styles.followText}>
                {item?.isFollowing ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          )}
          <View style={styles.moreIcon}>
            <MoreIcon width={14} height={4} />
          </View>
        </View>
      </View>

      <View style={styles.thumbnailWrap}>
        <FastImage
          source={{uri: item?.thumbnailUrl || ''}}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.overlayRow} pointerEvents="none">
          <View style={styles.badgeRow}>
            {item?.isLive !== false && (
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
            {isVR && (
              <View style={styles.vrBadge}>
                <Text style={styles.vrText}>VR</Text>
              </View>
            )}
          </View>
          <View style={styles.viewsBadge}>
            <ViewIcon width={12} height={12} />
            <Text style={styles.viewsText}>
              {formatCount(item?.viewsCount || 0).toLowerCase()}
            </Text>
          </View>
        </View>
        <View style={styles.volumeButton} pointerEvents="none">
          <ShortsVolumeIcon width={15} height={17} />
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item?.title}
        </Text>
        {!!item?.tags?.length && (
          <View style={styles.tagsRow}>
            {item.tags.slice(0, 4).map((tag: string) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default ProfileLiveCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 34,
    gap: 12,
  },
  identity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
  },
  identityText: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 13.5,
    lineHeight: 17,
    fontFamily: fonts['Poppins-Medium'],
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 0,
  },
  username: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: fonts['Poppins-Regular'],
    color: '#8D8C8C',
    letterSpacing: -0.12,
    maxWidth: 80,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
  time: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts['Poppins-Regular'],
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moreIcon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{rotate: '90deg'}],
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    paddingTop: 5,
    paddingRight: 8,
    paddingBottom: 5,
    paddingLeft: 6,
    height: 25,
    gap: 4,
  },
  followText: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: fonts['Poppins-Medium'],
    color: '#FFFFFF',
    letterSpacing: -0.12,
  },
  thumbnailWrap: {
    width: '100%',
    height: 210,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlayRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    height: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveBadge: {
    backgroundColor: '#D03825',
    borderRadius: 4,
    paddingHorizontal: 3,
    paddingVertical: 2,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveText: {
    fontSize: 11,
    lineHeight: 12,
    fontFamily: fonts['Poppins-SemiBold'],
    color: '#FFFFFF',
    letterSpacing: -0.33,
  },
  vrBadge: {
    backgroundColor: '#FAFAFA',
    borderRadius: 4,
    paddingHorizontal: 3,
    paddingVertical: 2,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vrText: {
    fontSize: 11,
    lineHeight: 12,
    fontFamily: fonts['Poppins-SemiBold'],
    color: '#111111',
    letterSpacing: -0.33,
  },
  viewsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(36, 35, 35, 0.7)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 3,
    height: 18,
    gap: 4,
  },
  viewsText: {
    fontSize: 11,
    lineHeight: 12,
    fontFamily: fonts['Poppins-SemiBold'],
    color: '#FAFAFA',
    letterSpacing: -0.22,
  },
  volumeButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 24,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(36, 35, 35, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    width: '100%',
    gap: 10,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: fonts['Poppins-SemiBold'],
    color: '#F0F0F0',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    height: 23,
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: fonts['Poppins-Medium'],
    color: '#EEEEEE',
    letterSpacing: -0.12,
  },
});
