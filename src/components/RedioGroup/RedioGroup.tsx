/**
 * Custom RadioGroup Component
 *
 * Usage Example:
 *
 * const options = [
 *   { label: 'Relevance', value: 'relevance' },
 *   { label: 'New arrivals', value: 'new_arrivals' },
 *   { label: 'Rating: High to Low', value: 'rating_high_low' },
 *   { label: 'Cost: Low to High', value: 'cost_low_high' }
 * ];
 *
 * const [selectedValue, setSelectedValue] = useState('relevance');
 *
 * <RadioGroup
 *   options={options}
 *   selectedValue={selectedValue}
 *   onValueChange={setSelectedValue}
 *   direction="column" // or "row"
 * />
 */

import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';

interface RadioOption {
  label: string;
  value: string | number;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue?: string | number;
  onValueChange: (value: string | number) => void;
  containerStyle?: any;
  itemStyle?: any;
  textStyle?: any;
  selectedTextStyle?: any;
  radioButtonStyle?: any;
  selectedRadioButtonStyle?: any;
  direction?: 'row' | 'column';
  disabled?: boolean;
}

export default function RadioGroup({
  options,
  selectedValue,
  onValueChange,
  containerStyle,
  itemStyle,
  textStyle,
  selectedTextStyle,
  radioButtonStyle,
  selectedRadioButtonStyle,
  direction = 'column',
  disabled = false,
}: RadioGroupProps) {
  const handlePress = (value: string | number) => {
    if (!disabled) {
      onValueChange(value);
    }
  };

  return (
    <View
      style={[
        styles.container,
        direction === 'row' ? styles.rowDirection : styles.columnDirection,
        containerStyle,
      ]}>
      {options.map((option, index) => {
        const isSelected = selectedValue === option.value;

        return (
          <TouchableOpacity
            key={index}
            style={[styles.radioItem, itemStyle]}
            onPress={() => handlePress(option.value)}
            disabled={disabled}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.radioText,
                textStyle,
                isSelected && styles.selectedRadioText,
                isSelected && selectedTextStyle,
                disabled && styles.disabledText,
              ]}>
              {option.label}
            </Text>

            <View
              style={[
                styles.radioButton,
                radioButtonStyle,
                isSelected && styles.selectedRadioButton,
                isSelected && selectedRadioButtonStyle,
                disabled && styles.disabledRadioButton,
              ]}>
              {isSelected && (
                <View
                  style={[
                    styles.radioInner,
                    disabled && styles.disabledRadioInner,
                  ]}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  rowDirection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  columnDirection: {
    flexDirection: 'column',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 4,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF4D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  selectedRadioButton: {
    borderColor: Colors.white,
    backgroundColor: 'transparent',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  radioText: {
    fontSize: fontSize.f14,
    color: '#FFFFFF4D',
    flex: 1,
  },
  selectedRadioText: {
    fontSize: fontSize.f12,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  disabledRadioButton: {
    borderColor: '#CCCCCC',
    backgroundColor: '#F5F5F5',
  },
  disabledRadioInner: {
    backgroundColor: Colors.white,
  },
  disabledText: {
    color: '#999999',
  },
});
