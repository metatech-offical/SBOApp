import {Text, StyleSheet, Pressable, Image} from 'react-native';
import React from 'react';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';

const ItemCategoryItem = ({
  item,
  onPress,
  isSelected,
}: {
  item: any;
  onPress: (id: string) => void;
  isSelected: boolean;
}) => {
  const isAllItems = item?.name === 'All Items' || item?.name === 'All';

  return (
    <Pressable
      style={[
        styles.container,
        isSelected ? styles.selected : styles.unselected,
      ]}
      onPress={() => onPress(item.id)}>
      {!isAllItems ? (
        <Image
          source={require('@assets/images/CategoryIcon.png')}
          style={[
            styles.image,
            {tintColor: isSelected ? Colors.black : Colors.white},
          ]}
        />
      ) : null}
      <Text
        style={[
          styles.text,
          {color: isSelected ? Colors.black : Colors.white},
        ]}>
        {item.name}
      </Text>
    </Pressable>
  );
};

export default ItemCategoryItem;

const styles = StyleSheet.create({
  container: {
    height: 35,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 6,
  },
  selected: {
    backgroundColor: Colors.white,
  },
  unselected: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  text: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    includeFontPadding: false,
  },
  image: {
    width: 16,
    height: 16,
  },
});
