import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React, {FC, useMemo} from 'react';
import { useAppSelector } from '@store/index';
import { fonts } from '@constant/fontfamily';
import {SearchIcon} from '@assets/svg/HomeScreenIcon';
import { CrossIcon } from '@assets/svg/AuthFlowIcons';
import { Colors } from '@constant/colors';
import { fontSize } from '@constant/fontSize';

const SearchBar: FC<SearchBarProps> = ({
  value,
  onChange,
  onIconPress,
  onsubmitEditing,
  placeholder = 'Type here...',
  style = {},
  containerStyle = {},
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputContainer,style]}>
        <View style={styles.innerViewStyle}>
          <SearchIcon height={'18px'} width={'18px'} color={'#ffffff'} />
          <TextInput
            value={value}
            placeholder={placeholder}
            onChangeText={onChange}
            style={styles.inputStyle}
            placeholderTextColor={'#B1B0B0'}
            onSubmitEditing={e => onsubmitEditing?.(e.nativeEvent.text)}
          />
        </View>
        {value?.length > 0 && (
          <TouchableOpacity
            style={styles.eyeStyle}
            activeOpacity={0.5}
            onPress={() => onIconPress?.(value)}>
            <CrossIcon color={'#D9D9D9'} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchBar;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 15,
      marginBottom: 15,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 50,
      width: '95%',
      borderRadius: 8,
      backgroundColor: Colors.black,
      paddingHorizontal: 15, // Add padding to provide spacing
      shadowOpacity: 0.2,
      shadowOffset: {width: 0, height: 1.5},
    },
    innerViewStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1, // Allow innerViewStyle to expand
    },
    inputStyle: {
      flex: 1, // Allow TextInput to expand
      paddingLeft: 10,
      color: '#ffffff',
      fontFamily: fonts['Poppins-Regular'],
      fontSize: fontSize.f12,
      lineHeight: 17,
    },
    eyeStyle: {
      paddingHorizontal: 6,
    },
  });
