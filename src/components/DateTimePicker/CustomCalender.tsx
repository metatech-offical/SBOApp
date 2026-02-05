import React, {
  useMemo,
  useState,
  useEffect,
  memo,
  useCallback,
  useRef,
} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {CalendarProvider, ExpandableCalendar} from 'react-native-calendars';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
dayjs.extend(utc);

interface CustomCalenderProps {
  calendarBackground?: string;
  setSelectedDate?: (date: string) => void;
  initialDate?: string;
  isCalendarLoading?: boolean;
  onYearChange?: (year: number) => void;
  isDefaultOpen?: boolean;
  disablePastDates?: boolean; // For event creation - disable past, enable future
}

const CustomCalender = ({
  calendarBackground = '#0E0D14',
  setSelectedDate,
  initialDate,
  isCalendarLoading = false,
  onYearChange,
  isDefaultOpen = false,
  disablePastDates = false,
}: CustomCalenderProps) => {
  const today = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
  const isSelectedDate = useMemo(
    () => (initialDate ? dayjs(initialDate).format('YYYY-MM-DD') : today),
    [initialDate, today],
  );

  const currentMonthRef = useRef(dayjs(isSelectedDate));
  const [headerTitle, setHeaderTitle] = useState('');

  const prevMonthRef = useRef({
    month: currentMonthRef.current.month() + 1,
    year: currentMonthRef.current.year(),
  });

  useEffect(() => {
    const formattedTitle = currentMonthRef.current.format(
      'ddd, MMMM DD • YYYY',
    );
    setHeaderTitle(formattedTitle);
  }, []);

  const customTheme = useMemo(
    () => ({
      backgroundColor: calendarBackground,
      calendarBackground: '#0E0D14',
      textSectionTitleColor: 'white',
      selectedDayBackgroundColor: '#A442F1',
      selectedDayTextColor: '#FFFFFF',
      todayTextColor: 'white',
      dayTextColor: 'white',
      textDisabledColor: '#666666',
      dotColor: 'red',
      selectedDotColor: 'white',
      arrowColor: 'white',
      monthTextColor: 'white',
      textDayFontFamily: fonts['Poppins-Regular'],
      textMonthFontFamily: fonts['Poppins-Regular'],
      textDayHeaderFontFamily: fonts['Poppins-Regular'],
      textDayFontSize: 16,
      textMonthFontSize: 18,
      textDayHeaderFontSize: 14,
    }),
    [calendarBackground, fonts],
  );

  const CustomDay = useCallback(
    (props: any) => {
      const {date, onPress} = props;
      const isSelected = date?.dateString === isSelectedDate;
      const isFuture = date?.dateString > today;
      const isPast = date?.dateString < today;

      // Determine if date should be disabled
      const isDisabled = disablePastDates ? isPast : isFuture;

      const handlePress = () => {
        if (!isDisabled) {
          onPress?.(date);
        }
      };

      // Disable dates based on prop (past for events, future for journal)
      if (isDisabled) {
        return (
          <View style={styles.centerView}>
            <View style={styles.disabledDayContainer}>
              <Text style={styles.disabledDayText}>{date.day}</Text>
            </View>
          </View>
        );
      }

      // Selected date with purple background
      if (isSelected) {
        return (
          <TouchableOpacity
            onPress={handlePress}
            style={styles.centerContainer}>
            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDateText}>{date.day}</Text>
            </View>
          </TouchableOpacity>
        );
      }

      // Enabled dates - all selectable
      return (
        <TouchableOpacity onPress={handlePress} style={styles.centerContainer}>
          <View style={styles.defaultDayContainer}>
            <Text style={styles.defaultDayText}>{date.day}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [today, isSelectedDate, styles, disablePastDates],
  );

  const handleMonthChange = useCallback(
    (month: {year: number; month: number}) => {
      if (
        month.month !== prevMonthRef.current.month ||
        month.year !== prevMonthRef.current.year
      ) {
        currentMonthRef.current = dayjs(`${month.year}-${month.month}-01`);
        prevMonthRef.current = {month: month.month, year: month.year};

        const formattedTitle = currentMonthRef.current.format(
          'ddd, MMMM DD • YYYY',
        );
        setHeaderTitle(formattedTitle);

        if (onYearChange) {
          onYearChange(month.year);
        }
      }
    },
    [onYearChange],
  );

  const handleDayPress = useCallback(
    (day: {dateString: string}) => {
      // Prevent selecting disabled dates
      if (disablePastDates) {
        // For events: prevent selecting past dates
        if (day.dateString < today) {
          return;
        }
      } else {
        // For journal: prevent selecting future dates
        if (day.dateString > today) {
          return;
        }
      }

      setSelectedDate?.(day?.dateString ?? isSelectedDate);

      currentMonthRef.current = dayjs(day.dateString);
      const formattedTitle = currentMonthRef.current.format(
        'ddd, MMMM DD • YYYY',
      );
      setHeaderTitle(formattedTitle);
    },
    [today, setSelectedDate, isSelectedDate, disablePastDates],
  );

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{headerTitle}</Text>
      </View>
    );
  }, [headerTitle, styles]);

  const containerStyle: any = useMemo(
    () => ({
      flex: 1,
      backgroundColor: '#0E0D14',
      paddingVertical: 5,
      marginLeft: -9,
      marginRight: 9,
      width: '105%',
      overflow: 'visible',
    }),
    [],
  );

  const calendarStyle = useMemo(
    () => ({
      width: WINDOW_WIDTH,
      overflow: 'hidden',
    }),
    [WINDOW_WIDTH],
  );

  const headerStyle = useMemo(
    () => ({
      width: '105%',
      paddingRight: 35,
      marginTop: -5,
    }),
    [],
  );

  return (
    <View style={containerStyle} pointerEvents="box-none">
      <CalendarProvider date={isSelectedDate} todayBottomMargin={16}>
        <ExpandableCalendar
          markingType={'custom'}
          theme={customTheme}
          headerStyle={headerStyle as any}
          monthFormat={'ddd, MMMM dd • yyyy'}
          dayComponent={CustomDay}
          onMonthChange={handleMonthChange}
          initialPosition={isDefaultOpen ? 'open' : ('closed' as any)}
          style={calendarStyle as any}
          calendarWidth={WINDOW_WIDTH}
          closeOnDayPress={false}
          displayLoadingIndicator={isCalendarLoading}
          renderHeader={renderHeader}
          firstDay={1}
          minDate={disablePastDates ? today : undefined}
          maxDate={disablePastDates ? undefined : today}
          disableAllTouchEventsForDisabledDays={true}
          onDayPress={handleDayPress}
          leftArrowImageSource={require('../../assets/images/leftArrow.png')}
          rightArrowImageSource={require('../../assets/images/rightArrow.png')}
        />
      </CalendarProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  centerView: {
    alignItems: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledDayContainer: {
    backgroundColor: '#2E2C35',
    borderRadius: 5,
    width: 33,
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledDayText: {
    color: '#EEEEEF',
    opacity: 0.5,
    fontFamily: fonts['Poppins-Regular'],
    fontSize: fontSize.f12,
  },
  defaultDayContainer: {
    backgroundColor: '#2E2C35',
    width: 33,
    height: 33,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultDayText: {
    color: '#EEEEEF',
    fontFamily: fonts['Poppins-Regular'],
    fontSize: fontSize.f12,
  },
  selectedDateContainer: {
    backgroundColor: '#A442F1',
    borderRadius: 5,
    width: 33,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDateText: {
    color: '#FFFFFF',
    fontFamily: fonts['Poppins-Regular'],
    fontSize: fontSize.f12,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  headerText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    color: 'white',
  },
});

export default memo(CustomCalender);
