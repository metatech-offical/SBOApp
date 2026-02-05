import {EyeShowIcon} from '@assets/svg/AuthFlowIcons';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {Stream} from '@rtkServices/LiveStreamServices/LiveServices';
import {RootState, useAppSelector} from '@store/index';
import {getTimeDifference, screenWidth} from '@utils/general';
import React from 'react';
import {View, Text, StyleSheet, Pressable, Image, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';

const LiveVideoCard = ({
  item,
  handleFollow,
  navigation,
  isOptionPress,
  type,
}: LiveCardContainerProps) => {
  const {user} = useAppSelector((state: RootState) => state.user);

  function handleNavigate() {
    navigation.navigate('');
  }

  function handleItemPress() {
    if (item?.isLive) {
      navigation.navigate('LiveViewer', {liveID: item?._id});
    }
  }

  return (
    <Pressable onPress={handleItemPress} style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Pressable
          onPress={handleNavigate}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          {item?.creator?.profilePicture ? (
            <FastImage
              source={{uri: item?.creator?.profilePicture}}
              style={styles.avatar}
            />
          ) : (
            <FastImage
              source={require('@assets/images/DummyUserImage.png')}
              style={styles.avatar}
            />
          )}

          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.userName}>
                {item?.creator?.displayName
                  ? item?.creator?.displayName
                  : item?.creator?.username}
              </Text>
            </View>
            <View style={{marginTop: 5}}>
              <Text numberOfLines={1} style={[styles.description]}>
                @{item?.creator?.username}
                {' • '}
                {getTimeDifference(item?.createdAt)}
              </Text>
            </View>
          </View>
        </Pressable>
        <View style={{flexDirection: 'row'}}>
          {item?.creator?._id !== user?._id && (
            <Pressable onPress={handleFollow} style={[styles.followButton]}>
              <Text style={[styles.followText]}>
                {item?.isFollowing ? 'Following' : '+ Follow'}
              </Text>
            </Pressable>
          )}

          {type !== 'profile' && (
            <Pressable onPress={isOptionPress}>
              <Image
                source={require('@assets/images/optionIcon.png')}
                style={styles.optionIcon}
                tintColor={Colors.white}
              />
            </Pressable>
          )}
        </View>
      </View>
      <Pressable onPress={handleItemPress}>
        <FastImage
          source={{uri: item?.thumbnailUrl || ''}}
          style={styles.thumbnail}>
          <View style={styles.liveTagContainer}>
            <View style={{flexDirection: 'row'}}>
              {item?.isLive && (
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              )}
            </View>
            <View style={{flexDirection: 'row'}}>
              {/* <View style={styles.viewCount}>
                <EyeShowIcon width={16} height={16} stroke={'#ffffff'} />
                <Text style={styles.viewCountText}>
                  {item?.viewsCount >= 1000
                    ? `${(item?.viewsCount / 1000).toFixed(1)}k`
                    : item?.viewsCount}
                </Text>
              </View> */}
            </View>
          </View>
        </FastImage>
      </Pressable>
      <View style={styles.cardFooter}>
        <Text numberOfLines={1} style={styles.title}>
          {item?.title}
        </Text>
      </View>
      <FlatList
        data={item?.tags || []}
        horizontal
        renderItem={({item, index}) => {
          return (
            <Pressable key={index} style={styles.tag}>
              <Text style={styles.tagText}>{item}</Text>
            </Pressable>
          );
        }}
        contentContainerStyle={styles.tagsContainer}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: '100%',
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  userName: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  followButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  followText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    alignSelf: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 12,
  },
  avatar: {
    width: screenWidth * 0.09, // Slightly smaller ratio
    height: screenWidth * 0.09,
    borderRadius: (screenWidth * 0.08) / 2,
    marginRight: 10,
  },
  optionIcon: {
    height: 24, // Fixed size instead of screenWidth ratio
    width: 12,
    marginLeft: 15, // Reduced margin
  },
  liveTagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  tagWrapper: {
    height: 20,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  viewCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242323B2',
    height: 25,
    justifyContent: 'center',
    borderRadius: 7,
    padding: 5,
  },
  viewCountText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    marginLeft: 7,
  },
  cardFooter: {
    padding: 10,
  },
  description: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.grey,
  },
  tagsContainer: {
    paddingHorizontal: 10,
  },
  tagViewStyle: {
    height: 25,
    backgroundColor: '#242323',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    paddingHorizontal: 5,
  },
  icon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
  liveBadge: {
    position: 'absolute',
    top: 3,
    left: 3,
    backgroundColor: '#E53935',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 6,
    height: 6,
    backgroundColor: Colors.white,
    borderRadius: 3,
    marginRight: 4,
  },
  liveText: {
    fontSize: fontSize.f8,
    color: Colors.white,
    fontFamily: fonts['Poppins-Bold'],
  },
  viewCount: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: 'rgba(0,0,0,0.76)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  title: {
    color: Colors.white,
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  tag: {
    backgroundColor: 'rgba(87, 87, 87, 0.23)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: '#D1D5DB',
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
  },
});

export default LiveVideoCard;
