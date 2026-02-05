import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {LivePlayerProps} from '@navigation/screens';
import {fonts} from '@constant/fontfamily';
import CustomBottomSheet from '@components/CustomBottomSheet/CustomBottomSheet';
import LinearGradient from 'react-native-linear-gradient';
import CustomeLoading from '@components/CustomLoader/Loader';
import CustomPlayerHeader from '@components/PlayerScreenComponent/CustomPlayerHeader';
import CustomVideoPlayer from '@components/PlayerScreenComponent/CustomVideoPlayer';
import Controlers from '@components/PlayerScreenComponent/Controlers';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
const {height} = Dimensions.get('screen');

const LivePlayer = ({navigation, route}: LivePlayerProps) => {
  const {streamId}: any = route?.params ?? {streamId: ''};
  const videoPlayer: any = useRef(null);
  const sheetRef = useRef(null);

  const [streamDetail, setStreamDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedUrl, setSelectedUrl] = useState<string>('');

  const [paused, setPaused] = useState<boolean>(false);
  const [muted, setMute] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);

  const CreatorData = streamDetail?.stream?.creator;
  const isFollowing = !!CreatorData?.isFollowing;

  const [isOpenSheet, setIsOpenSheet] = useState<boolean>(false);
  const [isOpenSheet2, setIsOpenSheet2] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);

  const onLoad = (): void => {
    setDuration(Math.floor(duration));
  };

  const handleFollow = () => {};

  // Render Video Quality section
  const RenderVideoQualitySheet = useCallback(() => {
    return (
      <FlatList
        // data={VideoQualityOptions}
        data={[]}
        renderItem={renderVideoQualityItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }, []);
  const renderVideoQualityItem = useCallback(
    ({
      item,
    }: {
      item: {id: number; label: string; value: string; default: boolean};
    }) => (
      <Pressable
        onPress={() => {
          setIsOpenSheet2(false);
          setIsOpenSheet(false);
        }}
        style={[
          styles.videoQualityItem,
          {
            backgroundColor: item.default ? Colors.white : 'transparent',
          },
        ]}>
        <Text style={styles.videoQualityItemText}>{item.label}</Text>
      </Pressable>
    ),
    [styles],
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <CustomeLoading visible={isLoading} />
      ) : (
        <View style={styles.videoContainer}>
          <CustomPlayerHeader
            navigation={navigation}
            CreatorData={CreatorData}
            isFollowing={isFollowing}
            selectedUrl={selectedUrl}
            streamDetail={streamDetail}
            handleFollow={handleFollow}
            handleSetting={() => setIsOpenSheet(true)}
            showSettingIcon={true}
          />
          <CustomVideoPlayer
            playerRef={videoPlayer}
            uri={selectedUrl}
            paused={paused}
            muted={muted}
            onProgress={() => {}}
            onLoad={onLoad}
            onError={err => {
              console.log('Video Player Err', err);
              if (err) {
                setProcessing(true);
              }
            }}
            onEnd={() => {}}
          />
          <Controlers
            paused={paused}
            setPaused={setPaused}
            muted={muted}
            setMuted={setMute}
            isLive={true}
            seekBackward={() => {}}
            seekForward={() => {}}
          />
          <View style={styles.bottomView}>
            <LinearGradient
              useAngle={true}
              angle={180.11}
              locations={[0.001, 0.1636, 0.999]}
              colors={[
                'rgba(19, 18, 18, 0)',
                'rgba(18, 17, 17, 0.2)',
                'rgba(17, 17, 17, 1)',
              ]}
              style={{flex: 1}}>
              {/* <LiveChatList liveChatData={liveChatData} /> */}
              {/* <LivePlayerBottomChat
                like={like}
                likeCount={likeCount}
                handleLike={handleLike}
                isCollapsed={isCollapsed}
                streamDetail={streamDetail}
                setIsCollapsed={setIsCollapsed}
                handlePressSubmit={handleLiveChatSubmit}
              /> */}
            </LinearGradient>
          </View>
        </View>
      )}
      {isOpenSheet && (
        <CustomBottomSheet
          label={''}
          ref={sheetRef}
          index={0}
          renderView={() => {}}
          onClose={() => setIsOpenSheet(false)}
          onPress={() => setIsOpenSheet(false)}
        />
      )}
      {isOpenSheet2 && (
        <CustomBottomSheet
          label={'Video Quality'}
          ref={sheetRef}
          index={2}
          renderView={RenderVideoQualitySheet}
          onClose={() => setIsOpenSheet2(false)}
          onPress={() => setIsOpenSheet2(false)}
          // contentViewStyle={{paddingHorizontal: 0}}
        />
      )}
    </SafeAreaView>
  );
};
export default LivePlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  sheetContent: {
    height: height * 0.45,
    maxHeight: height * 0.8,
    minHeight: height * 0.3,
    zIndex: 7,
    alignContent: 'flex-end',
  },
  sheetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 27,
    height: 27,
  },
  name: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    marginLeft: 10,
  },
  videoQualityItemText: {
    color: Colors.white,
    fontFamily: fonts['Poppins-Regular'],
    fontSize: fontSize.f14,
  },
  videoQualityItem: {
    height: 50,
    width: '100%',
    marginTop: 5,
    borderRadius: 5,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    marginLeft: 5,
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
