import React, {memo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Video from 'react-native-video';

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  playerRef,
  uri,
  paused = false,
  muted = false,
  onProgress,
  onLoad,
  onError,
  renderView,
  onEnd,
  playbackRate,
}) => {
  const [isBuffering, setIsBuffering] = useState(false);
  const RenderView = renderView;

  return (
    <View style={styles.videoContainer}>
      <Video
        ref={playerRef}
        source={{
          uri,
        }}
        progressUpdateInterval={1000}
        ignoreSilentSwitch="ignore"
        maxBitRate={2000000}
        style={styles.videoPlayerStyle}
        resizeMode="cover"
        repeat
        rate={playbackRate}
        muted={muted}
        onProgress={onProgress}
        onLoad={onLoad}
        controls={false}
        paused={paused}
        onError={onError}
        onBuffer={({isBuffering}) => {
          setIsBuffering(isBuffering);
          console.log(
            isBuffering ? 'Video buffering started' : 'Video buffering ended',
          );
        }}
        onEnd={() => {}}
        onLoadStart={() => setIsBuffering(true)}
        onReadyForDisplay={() => setIsBuffering(false)}>
        <View style={styles.contentContainer}>
          {RenderView && <RenderView />}
        </View>
      </Video>
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  videoPlayerStyle: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
  },
  videoStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default memo(CustomVideoPlayer);
