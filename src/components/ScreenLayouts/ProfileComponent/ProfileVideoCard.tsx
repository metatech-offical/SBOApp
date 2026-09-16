import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import {ViewIcon} from '@assets/svg/CommonIcons';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {formatCount} from '@utils/helper';

export type ProfileVideoItem = {
  _id: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  viewsCount?: number;
  duration?: number;
  createdAt?: string;
  tags?: string[];
  isLive?: boolean;
  videoUrl?: string;
  settings?: {
    visibility?: string;
  };
};

type ProfileVideoCardProps = {
  item: ProfileVideoItem;
  onPress: () => void;
};

const formatDuration = (seconds?: number) => {
  const total = Number(seconds) || 0;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
};

const ProfileVideoCard = ({item, onPress}: ProfileVideoCardProps) => {
  const isSubscriberOnly =
    item.settings?.visibility === 'subscribers' && !item.videoUrl;
  const tags = (item.tags || []).filter(Boolean).slice(0, 4);
  const showTags = tags.length > 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={isSubscriberOnly}
      style={styles.card}>
      <View style={styles.thumbnailWrap}>
        <FastImage
          source={{
            uri: item.thumbnailUrl || 'https://via.placeholder.com/347x210',
          }}
          style={styles.thumbnail}
        />

        <View style={styles.overlayRow} pointerEvents="none">
          <View style={styles.overlayLeft}>
            {item.isLive ? (
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            ) : (
              <View />
            )}
          </View>
          <View style={styles.viewsBadge}>
            <ViewIcon width={12} height={12} />
            <Text style={styles.viewsText}>
              {formatCount(item.viewsCount || 0).toLowerCase()}
            </Text>
          </View>
        </View>

        {isSubscriberOnly && (
          <View style={styles.subscriberOnlyOverlay}>
            <Text style={styles.subscriberOnlyText}>Subscriber Only</Text>
          </View>
        )}
      </View>

      <View style={[styles.info, showTags && styles.infoWithTags]}>
        <Text
          style={[styles.title, showTags && styles.titleMuted]}
          numberOfLines={showTags ? 2 : 1}>
          {item.title}
        </Text>

        {showTags ? (
          <View style={styles.tagsRow}>
            {tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.metaRow}>
            <Text style={styles.streamedText}>
              {item.createdAt
                ? `Streamed ${moment(item.createdAt).fromNow()}`
                : 'Streamed recently'}
            </Text>
            {!!item.duration && (
              <Text style={styles.durationText}>
                {formatDuration(item.duration)}
              </Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default ProfileVideoCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    gap: 12,
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
    top: 8.27,
    left: 8,
    right: 8,
    height: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlayLeft: {
    minWidth: 47,
    alignItems: 'flex-start',
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
  info: {
    width: '100%',
    paddingHorizontal: 4,
    gap: 6,
  },
  infoWithTags: {
    gap: 10,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 16,
    lineHeight: 23,
    fontFamily: fonts['Poppins-Medium'],
    color: '#FFFFFF',
  },
  titleMuted: {
    color: '#A2A2A2',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streamedText: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts['Poppins-Regular'],
    color: '#B6B6B6',
  },
  durationText: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: '#FFFFFF',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  subscriberOnlyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscriberOnlyText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
