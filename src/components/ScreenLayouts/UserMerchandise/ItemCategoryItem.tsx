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
  return (
    <Pressable
      style={[
        styles.container,
        {backgroundColor: isSelected ? Colors.white : '#FFFFFF1A'},
      ]}
      onPress={() => onPress(item.id)}>
      <Image
        source={require('@assets/images/CategoryIcon.png')}
        style={[
          styles.image,
          {tintColor: isSelected ? Colors.black : Colors.white},
        ]}
      />
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
    flex: 1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor:Colors.white,
    marginRight: 10,
    minHeight: 33,
    minWidth: 110,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 5,
  },
  text: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.black,
  },
  image: {
    width: 20,
    height: 20,
  },
});
