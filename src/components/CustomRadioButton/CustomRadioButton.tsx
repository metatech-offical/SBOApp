import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import React, {useMemo} from 'react';
import {
  FlatList,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {RadioButton} from 'react-native-radio-buttons-group';

interface CustomRadioButtonProps {
  data?: Array<{id: string | number; label: string; value: string}>;
  onPress?: (item: {id: string | number; label: string; value: string}) => void;
  selectedFilter?: string;
  customTitleStyle?: TextStyle;
  customRadioViewStyle?: StyleProp<ViewStyle>;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  data,
  onPress,
  selectedFilter,
  customTitleStyle,
  customRadioViewStyle,
}) => {
  return (
    <View style={{}}>
      <FlatList
        data={data}
        renderItem={({item, index}) => {
          return (
            <Pressable
              onPress={() => onPress?.(item)}
              style={[
                styles.radioViewStyle,
                selectedFilter === item.value && customRadioViewStyle,
                {marginTop: index == 0 ? 6 : 0},
              ]}>
              <View style={{width: '90%'}}>
                <Text style={[styles.titleStyle, customTitleStyle]}>
                  {item.label}
                </Text>
              </View>
              <RadioButton
                id={''}
                color={Colors.white}
                selected={selectedFilter === item.value}
                borderColor={Colors.white}
                onPress={() => onPress?.(item)}
              />
            </Pressable>
          );
        }}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default React.memo(CustomRadioButton);

const styles = StyleSheet.create({
  radioViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingVertical: 4,
  },
  titleStyle: {
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
});
