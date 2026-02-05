import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@constant/colors';

const Loading = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={Colors.white} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
});
