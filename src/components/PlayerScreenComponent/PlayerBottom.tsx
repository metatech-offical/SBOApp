import React, {memo, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {fonts} from '@constant/fontfamily';
import Slider from '@react-native-community/slider';
import {formatTime} from '@utils/general';
import {ArrowUP} from '@assets/svg/AuthFlowIcons';
import FastImage from 'react-native-fast-image';
import {Colors} from '@constant/colors';
import { fontSize } from '@constant/fontSize';

const PlayerBottom = ({
  streamDetail,
  currentTime,
  onSeek,
  handleLike,
  like,
  likeCount,
  maxValueSlider,
  setIsCommentSheetOpen,
  isCommentSheetOpen,
  openNewCommentSheet,
}: any) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={{flex: 1}}>
      <Pressable onPress={() => setExpanded(!expanded)}>
        <Text
          style={styles.bottomTitle}
          numberOfLines={expanded ? undefined : 1}>
          {streamDetail?.data?.title || streamDetail?.stream?.title || ''}
          {!expanded &&
            (streamDetail?.data?.title || streamDetail?.stream?.title)?.length >
              30 &&
            '...'}
        </Text>
      </Pressable>
      <View style={styles.inputContainer}>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={maxValueSlider || 100}
            value={currentTime}
            step={1}
            onValueChange={onSeek}
            onSlidingComplete={onSeek}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor={Colors.black}
            thumbTintColor="#FFFFFF"
          />
        </View>
        <Text style={styles.timer}>{formatTime(currentTime)}</Text>

        {/* Comment Button */}
        <Pressable
          style={styles.commentButton}
          onPress={openNewCommentSheet}>
          <ArrowUP fill={'#ffffff'} />
        </Pressable>

        <Pressable
          onPress={handleLike}
          disabled={!streamDetail?.data?._id && !streamDetail?.stream?._id}
          style={styles.likeContainer}>
          <FastImage
            source={
              like
                ? require('../../assets/images/like2.png')
                : require('../../assets/images/like.png')
            }
            style={styles.sheetItemImage}
          />
          <Text style={styles.likeCount}>{likeCount}</Text>
        </Pressable>
      </View>
    </View>
  );
};
export default memo(PlayerBottom);

const styles = StyleSheet.create({
  bottomTitle: {
    color: Colors.white,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Bold'],
    paddingHorizontal: 10,
  },
  inputContainer: {
    paddingHorizontal: 23,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  slider: {
    height: 40,
    width: '90%',
  },
  sliderContainer: {
    flex: 1,
    width: '70%',
    minHeight: 40,
  },
  timer: {
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f12,
  },
  likeContainer: {
    width: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    color: Colors.white,
    fontFamily: fonts['Poppins-Regular'],
    fontSize: fontSize.f12,
    marginLeft: 3,
  },
  sheetItemImage: {
    width: 21,
    height: 21,
    marginRight: 3.5,
  },
  commentButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  commentIcon: {
    width: 21,
    height: 21,
    tintColor: '#ffffff',
  },
  commentText: {
    fontSize: fontSize.f16,
    color: '#ffffff',
  },
});
