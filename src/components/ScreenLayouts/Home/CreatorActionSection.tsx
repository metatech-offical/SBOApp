import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fontSize, width} from '@constant/fontSize';
import {creatorActionData} from '@utils/data';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';

const H_PADDING = 16;
const GAP = 12;
const CARD_WIDTH = (width - H_PADDING * 2 - GAP) / 2;
const CARD_HEIGHT = 92;

const CreatorActionSection = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      {creatorActionData?.map(item => (
        <Pressable
          key={item.id}
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
    paddingHorizontal: H_PADDING,
    alignItems: 'center',
    gap: GAP,
  },
  actionItem: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionItemText: {
    fontSize: fontSize.f16,
    lineHeight: 20,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
});

export default CreatorActionSection;
