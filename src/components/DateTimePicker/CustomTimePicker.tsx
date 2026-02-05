import React, {useRef, useCallback, memo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {compareSelectedDate, showToast} from '@utils/general';
import {ArrowIcon} from '@assets/svg/CommonIcons';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';

dayjs.extend(utc);

const TimePicker = ({
  onTimeSelected,
  initialTime,
  selectedDate,
  enableLimit = false,
}: {
  onTimeSelected: (time: string) => void;
  initialTime?: string;
  selectedDate: string;
  enableLimit?: boolean;
}) => {
  const result = compareSelectedDate(selectedDate);
  const isToday = result === 'today';
  const getInitialTime = () => {
    let time;

    if (initialTime) {
      time = dayjs(initialTime);

      if (!time.isValid()) {
        console.error(
          'Invalid initialTime format. Falling back to current time.',
        );
        time = dayjs();
      }
    } else {
      time = dayjs();
    }

    return {
      hour: time.format('hh'),
      minute: time.format('mm'),
      isAm: time.format('A') === 'AM',
    };
  };

  const initial = getInitialTime();
  const selectedHour = useRef(parseInt(initial.hour));
  const selectedMinute = useRef(parseInt(initial.minute));
  const isAm = useRef(initial.isAm);

  const triggerOnTimeSelected = useCallback(
    debounce(() => {
      const time = `${selectedHour.current
        .toString()
        .padStart(2, '0')}:${selectedMinute.current
        .toString()
        .padStart(2, '0')} ${isAm.current ? 'AM' : 'PM'}`;
      onTimeSelected(time);
    }, 200),
    [],
  );

  const handleUpdateHour = (increment: boolean) => {
    selectedHour.current = increment
      ? selectedHour.current === 12
        ? 1
        : selectedHour.current + 1
      : selectedHour.current === 1
      ? 12
      : selectedHour.current - 1;
    triggerOnTimeSelected();
  };

  const updateHour = (increment: boolean) => {
    if (isToday && enableLimit) {
      showToast('Cannot change time for current date');
      return;
    }
    if (!increment || !enableLimit) {
      handleUpdateHour(increment);
      return;
    }
    if (!isToday) {
      handleUpdateHour(increment);
    }
  };

  const handleUpdateMinute = (increment: boolean) => {
    selectedMinute.current = increment
      ? selectedMinute.current === 59
        ? 0
        : selectedMinute.current + 1
      : selectedMinute.current === 0
      ? 59
      : selectedMinute.current - 1;
    triggerOnTimeSelected();
  };

  const updateMinute = (increment: boolean) => {
    if (isToday && enableLimit) {
      showToast('Cannot change time for current date');
      return;
    }
    if (!increment || !enableLimit) {
      handleUpdateMinute(increment);
      return;
    }
    if (!isToday) {
      handleUpdateMinute(increment);
    }
  };

  const toggleAmPm = (isAmSelected: boolean) => {
    isAm.current = isAmSelected;
    if (!enableLimit) {
      triggerOnTimeSelected();
      return;
    }
    if (isToday && enableLimit) {
      showToast('Cannot change time for current date');
      return true;
    }

    if (!isToday) {
      triggerOnTimeSelected();
    }
  };

  return (
    <View style={styles.container}>
      {/* Hour Selector */}
      <View style={styles.selector}>
        <View style={styles.arrowContainer}>
          <TouchableOpacity hitSlop={20} onPress={() => updateHour(true)}>
            <ArrowIcon
              fill={'#BA8AEA'}
              width={20}
              height={20}
              style={styles.rotatedArrow}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.value}>
          {selectedHour.current.toString().padStart(2, '0')}
        </Text>
        <View style={styles.arrowContainer}>
          <TouchableOpacity hitSlop={20} onPress={() => updateHour(false)}>
            <ArrowIcon fill={'#BA8AEA'} width={20} height={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Separator */}
      <Text style={styles.separator}>:</Text>

      {/* Minute Selector */}
      <View style={styles.selector}>
        <View style={styles.arrowContainer}>
          <TouchableOpacity hitSlop={20} onPress={() => updateMinute(true)}>
            <ArrowIcon
              fill={'#BA8AEA'}
              width={20}
              height={20}
              style={styles.rotatedArrow}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.value}>
          {selectedMinute.current.toString().padStart(2, '0')}
        </Text>
        <View style={[styles.arrowContainer, {marginLeft: 5}]}>
          <TouchableOpacity hitSlop={20} onPress={() => updateMinute(false)}>
            <ArrowIcon fill={'#BA8AEA'} width={20} height={20} style={{}} />
          </TouchableOpacity>
        </View>
      </View>

      {/* AM/PM Toggle */}
      <View style={styles.ampmContainer}>
        <TouchableOpacity
          hitSlop={20}
          style={[styles.ampmButton, isAm.current && styles.activeButton]}
          onPress={() => toggleAmPm(true)}>
          <Text style={[styles.ampmText, isAm.current && styles.activeText]}>
            AM
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={20}
          style={[styles.ampmButton, !isAm.current && styles.activeButton]}
          onPress={() => toggleAmPm(false)}>
          <Text style={[styles.ampmText, !isAm.current && styles.activeText]}>
            PM
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 10,
    gap: 15,
  },
  selector: {
    alignItems: 'center',
    marginHorizontal: 10,
    gap: 10,
  },
  value: {
    color: 'white',
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    marginVertical: 5,
  },
  separator: {
    color: 'white',
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    top: 30,
  },
  ampmContainer: {
    flexDirection: 'column',
    marginLeft: 10,
    gap: 15,
  },
  ampmButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    width: 45,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    backgroundColor: '#2E2C35',
  },
  activeButton: {
    borderColor: '#A78BFA',
  },
  ampmText: {
    color: '#EEEEEF',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
  },
  activeText: {
    color: 'white',
  },
  arrowContainer: {
    width: 30,
    alignItems: 'center',
  },
  rotatedArrow: {
    transform: [{rotate: '180deg'}],
  },
});

export default memo(TimePicker);
