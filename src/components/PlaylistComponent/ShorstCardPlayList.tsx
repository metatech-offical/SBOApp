import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import {CheckIcon} from '@assets/svg/AuthFlowIcons';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

type ShortsProp = {
  id: string;
  thumbnailUrl: string;
  userId: string;
  duration: number;
};

type Props = {
  data: ShortsProp;
  selected: boolean;
  onPress: () => void;
};

const ShorstCardPlayList = ({data, selected, onPress}: Props) => {
  return (
    <Pressable style={styles.cardContainer} onPress={onPress}>
      <ImageBackground
        source={
          typeof data?.thumbnailUrl === 'string'
            ? {uri: data.thumbnailUrl}
            : data.thumbnailUrl
        }
        style={[styles.thumbnail, selected && {opacity: 0.4}]}
        imageStyle={styles.imageStyle}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.4)']}
          style={styles.gradientOverlay}
        />
        {data?.duration && (
          <Text style={styles.viewsText}>{data?.duration || 0}s</Text>
        )}
      </ImageBackground>

      {selected && (
        <View style={styles.checkIcon}>
          <CheckIcon
            height={16}
            width={16}
            fill={'#ffffff'}
            stroke={'#ffffff'}
          />
        </View>
      )}
    </Pressable>
  );
};

export default React.memo(ShorstCardPlayList);

const styles = StyleSheet.create({
  cardContainer: {
    width: (width - 35) / 3,
    aspectRatio: 0.8,
    marginHorizontal: 6,
    marginVertical: 5,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 5,
  },
  imageStyle: {
    borderRadius: 6,
  },
  viewsText: {
    color: Colors.white,
    fontSize: fontSize.f10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  checkIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#8800FF',
    width: 20,
    height: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 6,
  },
});
