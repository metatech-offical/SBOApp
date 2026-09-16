import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';

interface StoreListItemProps {
  item: StoreCollection;
  onPress: () => void;
}

const StoreListItem = ({item, onPress}: StoreListItemProps) => {
  const store = (item as any)?.store;
  const storeName = store?.name;
  const avatar = store?.owner?.profilePicture || store?.logo;
  const tags = item?.tags || [];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.8}>
      <View style={styles.header}>
        <FastImage
          source={
            avatar
              ? {uri: avatar}
              : require('@assets/images/DummyUserImage.png')
          }
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.storeName} numberOfLines={1}>
            {storeName || item.name}
          </Text>
          {item.description ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {item.description}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.imageWrap}>
        <FastImage
          source={
            item.coverImage
              ? {uri: item.coverImage}
              : require('@assets/images/dummyImage.png')
          }
          style={styles.image}
        />
      </View>

      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {item.name}
      </Text>

      {tags.length > 0 ? (
        <View style={styles.tagsRow}>
          {tags.slice(0, 4).map((tag, index) => (
            <View key={`${tag}-${index}`} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default StoreListItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F0F0F0',
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
  },
  storeName: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    includeFontPadding: false,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    marginTop: 2,
    includeFontPadding: false,
  },
  imageWrap: {
    width: '100%',
    height: 210,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
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
