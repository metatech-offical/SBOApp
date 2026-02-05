import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Colors} from '@constant/colors';

const Devider = () => {
  return <View style={styles.divider} />;
};

export default Devider;

const styles = StyleSheet.create({
  divider: {
    height: 0.5,
    backgroundColor: Colors.grey,
    marginVertical: 10,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
});
