import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';

export type HomeAvatarGridItem = {
  id: string;
  name: string;
  image?: string;
  onPress: () => void;
};

export default function HomeAvatarGrid({
  title,
  icon,
  items,
  extraCount = 0,
  onViewAll,
}: {
  title: string;
  icon: React.ReactNode;
  items: HomeAvatarGridItem[];
  extraCount?: number;
  onViewAll: () => void;
}) {
  if (!items.length) {
    return null;
  }

  const hasOverflow = extraCount > 0;
  const visibleItems = hasOverflow ? items.slice(0, 7) : items.slice(0, 8);

  return (
    <View style={styles.card}>
      <Pressable onPress={onViewAll} style={styles.header}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </Pressable>
      <View style={styles.grid}>
        {visibleItems.map(item => (
          <Pressable key={item.id} onPress={item.onPress} style={styles.cell}>
            <FastImage
              source={
                item.image
                  ? {uri: item.image}
                  : require('@assets/images/DummyUserImage.png')
              }
              style={styles.avatar}
            />
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
              {item.name}
            </Text>
          </Pressable>
        ))}
        {hasOverflow ? (
          <Pressable onPress={onViewAll} style={styles.cell}>
            <View style={styles.moreCircle}>
              <Text style={styles.moreText}>{extraCount}+</Text>
            </View>
            <Text numberOfLines={1} style={styles.name}>
              View all
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingTop: 21,
    paddingBottom: 27,
  },
  title: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 6,
    rowGap: 36,
  },
  cell: {
    width: '25%',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  name: {
    marginTop: 16,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    textAlign: 'center',
    width: 72,
    lineHeight: 16,
  },
  moreCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
});
