import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import NodataFound from '@components/DataEmpty/NodataFound';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';

const PastEvents = () => {
  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <FlatList
        data={[]}
        ListEmptyComponent={<NodataFound />}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <></>
          // <EventCard
          //   id={item.id}
          //   event_Name={item.event_Name}
          //   event_Cover_Image={item.event_Cover_Image}
          //   event_Date={item.event_Date}
          //   event_Status={item.event_Status}
          //   SoldticketsCount={item.SoldticketsCount}
          //   showStartTime={item.showStartTime}
          //   ShowEndTime={item.ShowEndTime}
          //   onPress={() => {}}
          // />
        )}
      />
    </View>
  );
};

export default PastEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
