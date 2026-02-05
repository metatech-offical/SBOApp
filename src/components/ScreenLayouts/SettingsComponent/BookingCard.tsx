import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@constant/colors';
import FastImage from 'react-native-fast-image';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';

const BookingCard = ({title, ticketCount, image}: any) => {
  return (
    <View style={styles.container}>
      <FastImage source={{uri: image}} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.ticketCount}>{ticketCount} tickets</Text>
        <Text style={styles.viewDetails}>View Details</Text>
      </View>
    </View>
  );
};

export default BookingCard;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Bold'],
  },
  ticketCount: {
    fontSize: fontSize.f12,
    color: Colors.grey,
  },
  image: {
    width: 70,
    height: 90,
    borderRadius: 10,
  },
  viewDetails: {
    fontSize: fontSize.f12,
    color: Colors.white,
    fontFamily: fonts['Poppins-Regular'],
    textDecorationLine: 'underline',
  },
});
