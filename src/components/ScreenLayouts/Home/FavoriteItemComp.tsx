import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import FastImage from 'react-native-fast-image';
import {navigate} from '@navigation/utils';
import LinearGradient from 'react-native-linear-gradient';
import {VerifiedIcon} from '@assets/svg/AuthFlowIcons';

export type CreatorListItem = {
  id: string;
  username: string;
  displayName?: string;
  profilePicture?: string;
  verified?: boolean;
  followersCount?: number;
  isFavorite: boolean;
};

const FavoriteItemComp = ({
  item,
  onToggleFavorite,
  disabled,
}: {
  item: CreatorListItem;
  onToggleFavorite: (item: CreatorListItem) => void;
  disabled?: boolean;
}) => {
  const subtitleParts = [
    item.displayName || item.username,
    item.followersCount != null ? `${item.followersCount} Followers` : null,
  ].filter(Boolean);

  return (
    <Pressable
      onPress={() => {
        navigate('OtherUserProfile', {userId: item.id});
      }}
      style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <FastImage
          source={
            item.profilePicture
              ? {uri: item.profilePicture}
              : require('@assets/images/DummyUserImage.png')
          }
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.usernameRow}>
          <Text numberOfLines={1} style={styles.username}>
            @{item.username}
          </Text>
          {item.verified ? (
            <VerifiedIcon width={14} height={14} />
          ) : null}
        </View>
        <Text numberOfLines={1} style={styles.subtitle}>
          {subtitleParts.join(' • ')}
        </Text>
      </View>
      {item.isFavorite ? (
        <Pressable
          hitSlop={8}
          disabled={disabled}
          onPress={() => onToggleFavorite(item)}
          style={styles.removeButton}>
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      ) : (
        <Pressable
          hitSlop={8}
          disabled={disabled}
          onPress={() => onToggleFavorite(item)}>
          <LinearGradient
            colors={['#1AD655', '#8800FF']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.addBorder}>
            <View style={styles.addInner}>
              <Text style={styles.addText}>Add</Text>
            </View>
          </LinearGradient>
        </Pressable>
      )}
    </Pressable>
  );
};

export default FavoriteItemComp;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textContainer: {
    flex: 1,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  username: {
    flexShrink: 1,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  subtitle: {
    marginTop: 2,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255,255,255,0.55)',
  },
  addBorder: {
    borderRadius: 8,
    padding: 1,
  },
  addInner: {
    minWidth: 46,
    height: 23,
    borderRadius: 7,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  addText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.black,
  },
  removeButton: {
    minWidth: 74,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  removeText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
});
