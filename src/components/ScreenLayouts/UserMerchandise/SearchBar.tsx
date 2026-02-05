import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {SearchIcon} from '@assets/svg/HomeScreenIcon';
import FastImage from 'react-native-fast-image';
import SearchInput from '@components/CustomInputs/SearchInput';

const SearchBar = ({
  showFilterIcon = true,
  value,
  onChangeText,
  placeholder,
  onFilterPress,
  icon,
}: {
  showFilterIcon?: boolean;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onFilterPress: () => void;
  icon?: React.ReactNode;
}) => {
  return (
    <View style={styles.container}>
      {/* <TextInputWithLabels
        placeholder="Search for merch..."
        onChangeText={onChangeText}
        value={value || ''}
        icon={<SearchIcon width={20} height={20} />}
        mainContainerProps={{
          flex: 1,
        }}
      /> */}

      <SearchInput
        placeholder={placeholder || 'Search for merch...'}
        onChangeText={onChangeText}
        value={value || ''}
        containerStyle={{
          flex: 1,
          height: 55,
          marginTop: 0,
          borderRadius: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderColor: 'rgba(164, 163, 163, 0.33)',
          shadowOpacity: 0.2,
          shadowOffset: {width: 0, height: 1.5},
        }}
        // icon={<SearchIcon width={20} height={20} />}
      />

      {showFilterIcon && (
        <View style={{width: '16%', marginLeft: 10}}>
          <TouchableOpacity
            style={[styles.filterIconView]}
            onPress={onFilterPress}>
            {icon ? (
              icon
            ) : (
              <FastImage
                source={require('@assets/images/FilterIcon.png')}
                style={{width: 20, height: 20}}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default memo(SearchBar);

const styles = StyleSheet.create({
  container: {
    // width: '9%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  filterIconView: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgba(164, 163, 163, 0.33)',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 1.5},
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    justifyContent: 'center',
    width: 55,
  },
});
