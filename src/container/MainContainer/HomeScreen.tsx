import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@constant/colors';

const HomeScreen = () => {
  console.log('Home Screen Loaded'); // Debug log
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text
        style={{
          fontSize: 30,
          color: Colors.black,
          fontWeight: 'bold',
          padding: 10,
        }}>
        HomeScreen
      </Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
