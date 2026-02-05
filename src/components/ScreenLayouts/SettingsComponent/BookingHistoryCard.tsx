import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import BookingCard from './BookingCard';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';

const BookingHistoryCard = ({date, cards}: BookingHistoryCardProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>{date}</Text>
      <FlatList
        data={cards}
        renderItem={({item}) => <BookingCard {...item} />}
      />
    </View>
  );
};

export default BookingHistoryCard;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  date: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    marginBottom: 10,
  },
});
