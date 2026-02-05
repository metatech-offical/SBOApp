import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import { fontSize } from '@constant/fontSize';

const CustomButton = ({
  isLoading,
  text,
  onPress,
  btnStyle,
  textStyle,
  icon,
  disabled = false,
  iconRight,
}: CustomButtonProp) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btnStyle, btnStyle]}
      disabled={disabled}>
      {!!isLoading ? (
        <ActivityIndicator size={40} color={Colors.grey} />
      ) : (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{marginRight: 8}}>{!!icon && icon}</View>
          <Text style={[styles.textStyle, textStyle]}>{text}</Text>
          <View style={{marginRight: 8}}>{!!iconRight && iconRight}</View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF1A',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 14,
    marginTop: 20,
  },
  textStyle: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: '#ffffff',
    textAlign: 'center',
  },
});
export default CustomButton;
