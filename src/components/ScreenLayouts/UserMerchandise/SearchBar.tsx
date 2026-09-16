import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React, {memo} from 'react';
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
      <SearchInput
        placeholder={placeholder || 'Search for merch...'}
        placeholderTextColor="rgba(255,255,255,0.5)"
        onChangeText={onChangeText}
        value={value || ''}
        containerStyle={styles.searchInput}
      />

      {showFilterIcon && (
        <TouchableOpacity
          style={styles.filterIconView}
          onPress={onFilterPress}>
          {icon ? (
            icon
          ) : (
            <FastImage
              source={require('@assets/images/FilterIcon.png')}
              style={styles.filterIcon}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(SearchBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 54,
    marginTop: 0,
    marginHorizontal: 0,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    paddingLeft: 16,
  },
  filterIconView: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
});
