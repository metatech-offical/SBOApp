import {
  StyleSheet,
  TextInput,
  TextInputProps,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';
import {CrossIcon} from '@assets/svg/AuthFlowIcons';
import {SearchIcon} from '@assets/svg/HomeScreenIcon';

interface SearchInputProps extends Omit<TextInputProps, 'style'> {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: object;
  disabled?: boolean;
  onPress?: () => void;
  value: string;
  debounce?: boolean;
}
const SearchInput: React.FC<SearchInputProps> = ({
  containerStyle,
  inputStyle,
  placeholder = 'Search',
  disabled = false,
  onPress = (text: string) => {},
  onChangeText,
  debounce = true,
  value,
  ...props
}) => {
  useEffect(() => {
    setTempSearch(value);
  }, [value]);

  const [tempSearch, setTempSearch] = useState(value);

  useEffect(() => {
    // Set a timer for debouncing
    if (debounce) {
      const debounceTimer = setTimeout(() => {
        onChangeText?.(tempSearch);
      }, 500); // 300ms delay

      // Cleanup function to clear the timer if component unmounts or searchText changes
      return () => clearTimeout(debounceTimer);
    } else {
      onChangeText?.(tempSearch);
    }
  }, [tempSearch]);

  return (
    <Pressable style={[styles.container, containerStyle]}>
      <SearchIcon width={22} height={22} stroke="white" />
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={Colors.white}
        onChangeText={setTempSearch}
        editable={!disabled}
        value={tempSearch}
        onSubmitEditing={() => {
          onPress(tempSearch);
        }}
        {...props}
      />
      {tempSearch?.length > 0 && (
        <Pressable
          onPress={() => {
            setTempSearch('');
          }}
          style={styles.crossIcon}>
          <CrossIcon color={Colors.white} />
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    backgroundColor: '#FFFFFF1A',
    height: 45,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingLeft: 20,
    gap: 10,
    paddingHorizontal: 10,
    paddingRight: 20,
  },
  input: {
    flex: 1,
    fontSize: fontSize.f16,
    color: Colors.white,
  },
  crossIcon: {
    padding: 10,
  },
});

export default SearchInput;
