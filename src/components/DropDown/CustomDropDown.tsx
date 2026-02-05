import React, {useRef, forwardRef, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {fonts} from '@constant/fontfamily';
import {ArrowDown, ArrowUP} from '@assets/svg/AuthFlowIcons';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const CustomDropDown = forwardRef<SelectDropdown, CustomDropDownProps>(
  (
    {
      data,
      placeHolder,
      commonStyle,
      onSelect,
      error,
      buttonTextStyle,
      isSearchable = false,
      defaultValue,
      containerStyle,
      label,
      isRequired = false,
      disabled,
      labelStyle,
      menuStyle,
    },
    ref,
  ) => {
    const selectDropdownRef = useRef<SelectDropdown>(null);

    const getValue = (item: any) => {
      if (item?.name) return item.name;
      if (item?.label) return item.label;
      if (item?.value) return item.value;
      return item;
    };

    const getListItem = (selectedItem: any) => {
      if (selectedItem) {
        return getValue(selectedItem);
      }
      if (defaultValue) {
        return getValue(defaultValue);
      }
      return placeHolder;
    };

    const getButtonTextColor = (selectedItem: any) => {
      if (selectedItem || defaultValue) {
        return Colors.white;
      }
      return Colors.grey;
    };

    return (
      <View style={containerStyle}>
        {label && (
          <View style={styles.labelContainer}>
            <Text style={[styles.labelStyle, labelStyle]}>{label}</Text>
          </View>
        )}
        <SelectDropdown
          ref={selectDropdownRef}
          disabled={disabled}
          data={data}
          onSelect={(selectedItem, index) => {
            onSelect(selectedItem);
          }}
          defaultValue={defaultValue}
          renderButton={(selectedItem, isOpened) => (
            <View style={[styles.dropdownButtonStyle, commonStyle]}>
              <Text
                style={[
                  styles.dropdownButtonTxtStyle,
                  {color: getButtonTextColor(selectedItem)},
                ]}>
                {getListItem(selectedItem)}
              </Text>
              {isOpened ? (
                <ArrowUP color={Colors.white} />
              ) : (
                <ArrowDown color={Colors.white} />
              )}
            </View>
          )}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={[styles.dropdownItemStyle]}>
                <Text style={styles.dropdownItemTxtStyle}>
                  {getValue(item)}
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={{...styles.dropdownMenuStyle, ...menuStyle}}
        />
        {error && <Text style={styles.errorStyle}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgba(164, 163, 163, 0.33)',
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
    height: 42,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Regular'],
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: fontSize.f13,
    color: Colors.white,
    fontFamily: fonts['Poppins-Regular'],
  },
  dropdownMenuStyle: {
    backgroundColor: 'rgba(104, 98, 98, 0.95)',
    borderRadius: 8,
    maxHeight: 250,
    overflow: 'hidden',
    elevation: 0,
  },
  labelStyle: {
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f12,
    marginBottom: 3,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  errorStyle: {
    color: Colors.red,
    fontFamily: fonts['Poppins-Regular'],
    fontSize: fontSize.f12,
    marginTop: 5,
  },
});

export default CustomDropDown;
