import React, {useCallback, useState} from 'react';
import {View, TouchableOpacity, Pressable, StyleSheet} from 'react-native';
import {PlayIcon, PauseIcon} from '@assets/svg/ShortsIcon';
import {
  BackwardIcon,
  ForwardIcon,
  SoundOff,
  SoundOn,
} from '@assets/svg/LiveSCreenIcon';

const Controlers = ({
  isLive,
  seekBackward,
  paused,
  setPaused,
  setMuted,
  muted,
  seekForward,
}: ControllersProps) => {
  const [visible, setVisible] = useState(false);

  const handleShowIcons = useCallback(() => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 3000);
  }, [visible]);

  return (
    <TouchableOpacity
      hitSlop={100}
      onPress={() => {
        handleShowIcons();
      }}
      style={styles.controlsContainer}>
      {visible && (
        <View style={styles.controlsWrapper}>
          {!isLive && (
            <Pressable onPress={seekBackward}>
              <BackwardIcon height={24} width={24} />
            </Pressable>
          )}
          <View style={styles.playButtonContainer}>
            <Pressable
              style={styles.pauseButton}
              onPress={() => setPaused(!paused)}>
              {paused ? (
                <PlayIcon fill={'#ffffff'} height={18} width={18} />
              ) : (
                <PauseIcon fill={'#ffffff'} height={18} width={18} />
              )}
            </Pressable>
            <Pressable onPress={() => setMuted(!muted)}>
              {muted == true ? (
                <SoundOff height={18} width={18} />
              ) : (
                <SoundOn height={18} width={18} />
              )}
            </Pressable>
          </View>
          {!isLive && (
            <Pressable onPress={seekForward}>
              <ForwardIcon height={24} width={24} />
            </Pressable>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};
export default Controlers;

const styles = StyleSheet.create({
  controlsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200, // Adjust based on your needs
  },
  seekButton: {
    height: 28,
    width: 28,
    marginRight: 20,
  },
  seekButton1: {
    height: 28,
    width: 28,
    marginLeft: 20,
  },
  pauseIcon: {
    height: 18,
    width: 18,
  },
  volumeIcon: {
    height: 18,
    width: 18,
  },
  pauseButton: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(141, 140, 140, 1)',
    paddingRight: 15,
    marginRight: 15,
  },
  playButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.35)',
    borderRadius: 55,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
