import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {getDayDateMonth} from '@utils/helper';

const EventCard = (props: EventCardProps) => {
  const {day, month, dayOfWeek} = getDayDateMonth(props?.event_Date);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={props?.onPress}
      activeOpacity={0.8}>
      <FastImage source={props?.event_Cover_Image} style={styles.image} />
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {props?.event_Name}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {`${props?.item?.eventLocation?.address}`} |{' '}
              {props?.showStartTime} - {props?.ShowEndTime}
            </Text>
          </View>
          <Text style={styles.priceText}>{'$100 onwards'}</Text>
        </View>
        <View style={styles.datePortal}>
          <View style={styles.dateupperView}>
            <Text style={styles.month}>{month}</Text>
          </View>
          <Text style={styles.day}>{day}</Text>
          <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 16,
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
    // width: '75%',
    marginRight: 8,
  },
  content: {
    flex: 1,
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
    color: '#6A6E71',
    fontSize: fontSize.f13,
    fontFamily: fonts['Poppins-Medium'],
    marginTop: 5,
  },
  ticketsSoldText: {
    color: '#ffffff',
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    marginTop: 5,
  },
  contentContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  datePortal: {
    borderRadius: 10,
    borderWidth: 1,
    width: 56,
    overflow: 'hidden',
    borderColor: '#ffffff20',
  },
  dateupperView: {
    paddingVertical: 2,
    backgroundColor: '#ffffff40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  month: {
    color: '#ffff',
    fontSize: fontSize.f13,
    fontFamily: fonts['Poppins-SemiBold'],
    textAlign: 'center',
  },
  day: {
    color: '#FFFFFF',
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    textAlign: 'center',
    lineHeight: 26,
  },
  dayOfWeek: {
    color: '#FFFFFF8F',
    fontSize: fontSize.f13,
    fontFamily: fonts['Poppins-SemiBold'],
    textAlign: 'center',
  },
  priceText: {
    color: '#B0AFB6',
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
  },
});
