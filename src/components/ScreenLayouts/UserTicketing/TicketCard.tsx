import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', {month: 'short'});
  const day = date.getDate();
  const dayOfWeek = date.toLocaleDateString('en-US', {weekday: 'short'});

  return {month, day, dayOfWeek};
};

const TicketCard = (props: TicketCardProps) => {
  const {month, day, dayOfWeek} = formatDate(props.event_Date);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={props.onPress}
      activeOpacity={0.8}>
      {typeof props.event_Cover_Image === 'string' && <FastImage
        source={{uri: props.event_Cover_Image || ''}}
        style={styles.image}
      />}
      <View style={styles.mainContainer}>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {props.event_Name}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {props.address} | {props.showStartTime} - {props.ShowEndTime}
            </Text>
          </View>
        </View>
        <View style={styles.DateContainer}>
          <View style={styles.dateWidget}>
            <View style={styles.monthSection}>
              <Text style={styles.monthText}>{month}</Text>
            </View>
            <View style={styles.daySection}>
              <Text style={styles.dayText}>{day}</Text>
            </View>
            <View style={styles.weekdaySection}>
              <Text style={styles.weekdayText}>{dayOfWeek}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TicketCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    width: '75%',
  },
  content: {
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveContainer: {
    backgroundColor: 'rgba(0, 255, 81, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  endedContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  liveText: {
    color: 'rgba(73, 255, 130, 1)',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  endedText: {
    color: 'rgba(207, 207, 207, 1)',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: 'rgba(207, 207, 207, 1)',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    marginTop: 5,
  },
  ticketsSoldText: {
    color: '#ffffff',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
    marginTop: 5,
  },
  DateContainer: {
    marginTop: 5,
  },
  dateWidget: {
    width: 60,
    height: 70,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(157, 157, 157, 0.34)',
  },
  monthSection: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(157, 157, 157, 0.34)',
  },
  monthText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Bold'],
    textAlign: 'center',
  },
  daySection: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#322838',
  },
  dayText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Bold'],
    textAlign: 'center',
  },
  weekdaySection: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#322838',
  },
  weekdayText: {
    color: '#8E8E93',
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Regular'],
    textAlign: 'center',
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
