import {View, Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {fonts} from '@constant/fontfamily';
import {PlusIcon} from '@assets/svg/CommonIcons';
import {CheckIcon} from '@assets/svg/AuthFlowIcons';
import FastImage from 'react-native-fast-image';
import {Colors} from '@constant/colors';
import { fontSize } from '@constant/fontSize';

const SelectableCard = ({item, selected, onPress}: any) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <FastImage
        source={{uri: item.thumbnailUrl}}
        style={[styles.img, selected && {opacity: 0.5}]}
      />

      <View style={styles.textContainer}>
        <Text style={[styles.description, selected && {color: Colors.white}]}>
          <Text style={[styles.titel, selected && {color: Colors.white}]}>
            {item.title}
          </Text>
          {`: ${item.description}`}
        </Text>
      </View>

      {selected ? (
        <View style={styles.checkButton}>
          <CheckIcon fill={Colors.white} width={24} height={24} />
        </View>
      ) : (
        <View style={styles.addButton}>
          <PlusIcon fill={Colors.white} />
        </View>
      )}
    </Pressable>
  );
};

export default SelectableCard;

const styles = StyleSheet.create({
  img: {
    width: 115,
    height: 75,
    borderRadius: 8,
    marginRight: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  titel: {
    color: Colors.white,
    fontSize: fontSize.f12,
    textTransform: 'uppercase',
    fontFamily: fonts['Poppins-SemiBold'],
  },
  description: {
    color: Colors.white,
    fontSize: fontSize.f12,
  },
  textContainer: {
    width: '57%',
  },
  addButton: {
    backgroundColor: '#333333',
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  checkButton: {
    backgroundColor: '#8800FF',
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
});
