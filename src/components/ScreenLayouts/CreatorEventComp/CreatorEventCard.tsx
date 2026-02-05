import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {eventFormatDate, eventFormatTime} from '@utils/general';

const CreatorEventCard = (props: CreatorEventCardProps) => {
  const formattedDate = eventFormatDate(props.event_Date);
  const formattedTime = eventFormatTime(props.event_Date);
  
  const getStatusStyle = () => {
    if (props.event_Status === 'Live') {
      return styles.liveContainer;
    } else if (props.event_Status === 'Coming') {
      return styles.comingContainer;
    } else {
      return styles.endedContainer;
    }
  };

  const getTextStyle = () => {
    if (props.event_Status === 'Live') {
      return styles.liveText;
    } else if (props.event_Status === 'Coming') {
      return styles.comingText;
    } else {
      return styles.endedText;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={props.onPress}
      activeOpacity={0.8}>
      <FastImage
        source={{
          uri: props.event_Cover_Image || '',
          priority: FastImage.priority.high,
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {props.event_Name}
          </Text>
          <View style={getStatusStyle()}>
            <Text style={getTextStyle()}>Sale {props.event_Status}</Text>
          </View>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {formattedDate} | {formattedTime}
          </Text>
          <Text style={styles.ticketsSoldText}>
            {props.SoldticketsCount} tickets sold
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CreatorEventCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: '100%',
    height: 230,
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
  comingContainer: {
    backgroundColor: 'rgba(255, 165, 0, 0.16)',
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
  comingText: {
    color: 'rgba(255, 165, 0, 1)',
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
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    marginTop: 5,
  },
});
