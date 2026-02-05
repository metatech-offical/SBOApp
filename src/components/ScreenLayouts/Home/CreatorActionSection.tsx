import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fontSize, hp, wp} from '@constant/fontSize';
import {creatorActionData} from '@utils/data';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';

const CreatorActionSection = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      {creatorActionData?.map(item => (
        <Pressable
          style={styles.actionItem}
          onPress={() => {
            navigation.navigate(item.screen);
          }}>
          <Text style={styles.actionItemText}>{item.title}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    alignItems: 'center',
    gap: wp('4%'),
  },
  actionItem: {
    width: wp('43'),
    height: hp('12'),
    backgroundColor: '#FFFFFF0F',
    borderRadius: wp('2'),
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    padding: wp('4%'),
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  actionItemText: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
});

export default CreatorActionSection;
