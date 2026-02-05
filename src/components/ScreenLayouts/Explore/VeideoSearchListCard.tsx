import React from 'react';
import {View, Text, Pressable, StyleSheet, ImageBackground} from 'react-native';
import {fonts} from '@constant/fontfamily';
import {fontSize, width} from '@constant/fontSize';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {videoTimeDuration} from '@utils/general';
import {Colors} from '@constant/colors';

const VideoSearchListCard = ({data}: any) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.cardContainer}
      onPress={() => {
        navigation.navigate('NormalPlayer', {
          streamId: data?._id,
        });
      }}>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={{uri: data?.thumbnailUrl || ''}}
          resizeMode="cover"
          style={styles.thumbnail}
          imageStyle={styles.imageRadius}
        />
        <View style={styles.overlayTopLeft}>
          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>
              {videoTimeDuration(data?.duration || 0)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {data?.title || ''}
          </Text>
        </View>
        <Text style={styles.channel}>@{data?.creator?.username}</Text>
        <View style={styles.viewsContainer}>
          <Text style={styles.views}>
            {`${data?.viewsCount || '0'} Views •`}
          </Text>
          <Text style={styles.views}>
            {moment(data?.createdAt)?.fromNow() || ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    width: width,
    alignSelf: 'center',
    marginVertical: 5,
    padding: 5,
    paddingHorizontal: 15,
  },
  imageContainer: {
    width: '38%',
    aspectRatio: 16 / 11,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  imageRadius: {
    borderRadius: 8,
  },
  overlayTopLeft: {
    flexDirection: 'row',
    position: 'absolute',
    top: 5,
    left: 5,
    columnGap: 4,
  },
  durationContainer: {
    backgroundColor: '#000000B2',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationText: {
    color: Colors.white,
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    marginBottom: 10,
    width: '92%',
    lineHeight: 15,
  },
  channel: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    marginBottom: 2,
    lineHeight: 15,
    opacity: 0.5,
  },
  viewsContainer: {
    flexDirection: 'row',
    columnGap: 5,
    marginTop: 5,
  },
  views: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    opacity: 0.5,
  },
});

export default React.memo(VideoSearchListCard);
