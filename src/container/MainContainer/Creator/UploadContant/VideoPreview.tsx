import {
  View,
  StyleSheet,
  Pressable,
  Text,
  FlatList,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {VideoPreviewProps} from '@navigation/screens';
import {fonts} from '@constant/fontfamily';
import {CrossIcon} from '@assets/svg/AuthFlowIcons';
import CustomBottomSheet from '@components/CustomBottomSheet/CustomBottomSheet';
import {VideoPreviewScreenSheetData} from '@utils/data';
import Video from 'react-native-video';
import {RightArrowIcon} from '@assets/svg/CommonIcons';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {fontSize, height, width} from '@constant/fontSize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PlayIcon} from '@assets/svg/ShortsIcon';
import {Colors} from '@constant/colors';

export default function VideoPreview({navigation, route}: VideoPreviewProps) {
  const {top} = useSafeAreaInsets();
  const {video, type} = route?.params || {};
  const sheetRef = useRef(null);
  const [isOpenSheet, setIsOpenSheet] = useState(false);
  const videoUri = video?.path || video?.uri || '';
  const isFocused = useIsFocused();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setPaused(!isFocused);
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setIsOpenSheet(true);
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  const handleNavigate = (item: any) => {
    setIsOpenSheet(false);
    if (item?.id == 2) {
      navigation.goBack();
    } else {
      setIsOpenSheet(false);
    }
  };

  const renderItem = ({item}: any) => (
    <Pressable
      onPress={() => handleNavigate(item)}
      style={styles.sheetPressableItem}>
      <FastImage source={item.image} style={styles.image} />
      <Text
        style={[
          styles.nameStyle,
          item.color ? {color: item.color} : {color: Colors.white},
        ]}>
        {item.name}
      </Text>
    </Pressable>
  );

  const goToUploadScreen = () => {
    navigation.navigate(
      type == 'video' ? 'VideoUploadScreen' : 'ShortsUploadScreen',
      {data: video},
    );
  };

  const RenderSheet = () => {
    return (
      <View style={{marginTop: 20}}>
        <FlatList
          data={VideoPreviewScreenSheetData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      {videoUri && (
        <View style={styles.videoContainer}>
          <Video
            source={{uri: videoUri}}
            style={styles.videoPlayer}
            controls={false}
            resizeMode={'contain'}
            playInBackground={false}
            playWhenInactive={false}
            paused={paused}
            repeat={true}
            onError={err => {
              console.log('error -->', JSON.stringify(err, null, 2));
            }}
          />
          {/* Fullscreen overlay to toggle play/pause */}
          <Pressable
            onPress={() => setPaused(prev => !prev)}
            style={styles.fullscreenToggle}
            hitSlop={0}>
            {paused && (
              <View style={styles.centerIconWrapper}>
                <PlayIcon height={28} width={28} />
              </View>
            )}
          </Pressable>

          {/* Top actions stay tappable above overlay */}
          <View style={[styles.topContainer, {marginTop: top + 20}]}>
            <View style={styles.crossContainer}>
              <TouchableOpacity
                hitSlop={20}
                onPress={() => setIsOpenSheet(true)}
                style={{width: '15%', marginLeft: 10}}>
                <CrossIcon fill={'#ffffff'} />
              </TouchableOpacity>
            </View>
            <View style={styles.nextContainer}>
              <Pressable style={styles.nextButton} onPress={goToUploadScreen}>
                <Text style={styles.btnTextStyle}>Next</Text>
                <RightArrowIcon fill={'#ffffff'} />
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {isOpenSheet && (
        <CustomBottomSheet
          label={'Are you sure you want to quit uploading?'}
          ref={sheetRef}
          index={2}
          renderView={RenderSheet}
          onClose={() => setIsOpenSheet(false)}
          onPress={() => setIsOpenSheet(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  videoContainer: {
    width: width,
    height: height,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  crossIconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnTextStyle: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#ffffff',
    marginLeft: 12,
  },
  nameStyle: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    marginLeft: 20,
    color: '#ffffff',
  },
  sheetPressableItem: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    height: 20,
    width: 20,
  },
  topContainer: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  crossContainer: {
    width: '50%',
    padding: 10,
  },
  nextContainer: {
    padding: 10,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    backgroundColor: '#E64258',
    borderRadius: 20,
    justifyContent: 'center',
    minHeight: 35,
  },
  fullscreenToggle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIconWrapper: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
