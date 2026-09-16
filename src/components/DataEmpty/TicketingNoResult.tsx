import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NoResultFoundIcon} from '@assets/svg/NoResultFoundIcon';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';

export default function TicketingNoResult() {
  return (
    <View style={styles.container}>
      <NoResultFoundIcon />
      <Text style={styles.title}>No result found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 16,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Regular'],
    color: '#F0F0F0',
    textAlign: 'center',
  },
});
