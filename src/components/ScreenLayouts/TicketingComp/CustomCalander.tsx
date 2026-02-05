import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Calendar} from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {LocationIcon} from '@assets/svg/TicktingIcons';
import {useNavigation} from '@react-navigation/native';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';

const CustomCalendar = () => {
  const [selectedDate, setSelectedDate] = useState('2025-04-23');
  const navigation = useNavigation();

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const currentDate = getCurrentDate();

  // Helper function to create event date styling
  const createEventDateStyle = () => ({
    marked: true,
    dotColor: 'transparent',
    customStyles: {
      container: {
        backgroundColor: 'rgba(70, 49, 89, 0.41)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#8b5cf6',
      },
      text: {
        color: '#b79df2',
        fontWeight: '600',
      },
    },
  });

  // Dummy event data - format: 'YYYY-MM-DD'
  const eventDates = {
    '2025-04-05': createEventDateStyle(),
    '2025-04-12': createEventDateStyle(),
    '2025-04-18': createEventDateStyle(),
    '2025-04-25': createEventDateStyle(),
    '2025-03-10': createEventDateStyle(),
    '2025-03-15': createEventDateStyle(),
    '2025-03-28': createEventDateStyle(),
    '2025-05-02': createEventDateStyle(),
    '2025-05-08': createEventDateStyle(),
    '2025-05-14': createEventDateStyle(),
    '2025-05-20': createEventDateStyle(),
    '2025-07-26': createEventDateStyle(),
  };

  // Add current date with green dot
  const currentDateMarking = {
    [currentDate]: {
      marked: true,
      dotColor: '#00ff00',
      today: true,
    },
  };

  const markedDates = {
    ...eventDates,
    ...currentDateMarking,
    [selectedDate]: {
      ...eventDates[selectedDate],
      ...currentDateMarking[selectedDate],
      selected: true,
      selectedColor: 'transparent',
      selectedTextColor: 'rgba(248, 245, 255, 0.8)',
    },
  };

  const handleDayPress = day => {
    setSelectedDate(day.dateString);

    // Check if the pressed date has an event
    if (eventDates[day.dateString]) {
      console.log('Hello - Event clicked for date:', day.dateString);
      navigation.navigate('BookTIcket' as never);
    }
  };

  const getEventCount = month => {
    const eventCount = Object.keys(eventDates).filter(date =>
      date.startsWith(month),
    ).length;
    return eventCount;
  };

  const renderHeader = date => {
    const currentMonth = date.toString('yyyy-MM');
    const monthName = date.toString('MMM yyyy');
    const eventCount = getEventCount(currentMonth);

    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{monthName}</Text>
        <Text style={styles.eventCountText}>
          {eventCount} {eventCount === 1 ? 'event' : 'events'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgb(20, 5, 60)', 'rgba(20, 11, 26, 0.8)']}
        style={styles.gradient}
      />
      <TextInputWithLabels
        placeholder="City / Zipcode"
        value={''}
        onChangeText={() => {}}
        mainContainerProps={{width: '100%', height: 45}}
        icon={<LocationIcon />}
        btnStyle={{height: 45}}
      />
      <Calendar
        current={currentDate}
        minDate={'2025-01-01'}
        maxDate={'2025-12-31'}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        renderHeader={renderHeader}
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: '#9ca3af',
          selectedDayBackgroundColor: '#6366f1',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00ff00',
          dayTextColor: '#e5e7eb',
          textDisabledColor: '#4b5563',
          dotColor: '#8b5cf6',
          selectedDotColor: '#8b5cf6',
          arrowColor: '#9ca3af',
          disabledArrowColor: '#4b5563',
          monthTextColor: '#ffffff',
          indicatorColor: '#6366f1',
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '400',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '400',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 13,
        }}
        style={styles.calendar}
        hideExtraDays={true}
        firstDay={1}
        showWeekNumbers={false}
        disableMonthChange={false}
        hideDayNames={false}
        showSixWeeks={false}
        disableAllTouchEventsForDisabledDays={true}
        enableSwipeMonths={true}
        markingType="custom"
      />
    </View>
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  gradient: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  calendar: {
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 20,
  },
  headerText: {
    marginBottom: 4,
    fontSize: fontSize.f20,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  eventCountText: {
    color: '#9ca3af',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
  },
});
