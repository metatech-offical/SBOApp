import { ClockIcon } from '@assets/svg/AuthFlowIcons';
import { Colors } from '@constant/colors';
import { fontSize } from '@constant/fontSize';
import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface ITimerProps {
  resetTimer: () => void;
  onTimerComplete: () => void;
}

export default function Timer({resetTimer, onTimerComplete}: ITimerProps) {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else {
          clearInterval(interval);
          onTimerComplete();
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <ClockIcon />
      <Text style={styles.timerText}>{seconds} sec</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      columnGap: 4,
    },
    timerText: {
      fontSize: fontSize.f12,
      color: Colors.white,
    },
  });
