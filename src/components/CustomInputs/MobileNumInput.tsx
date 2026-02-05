import React, {useEffect, useRef, useState} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';

// Map calling codes to ISO country codes
const getCountryCodeFromCallingCode = (callingCode: string) => {
  const mapping: {[key: string]: string} = {
    '91': 'IN', // India
    '44': 'GB', // UK
    '1': 'US', // USA
    '86': 'CN', // China
    // Add more as needed
  };
  return mapping[callingCode] || 'GB';
};

const MobileNumInput = ({
  label,
  value,
  placeholder,
  isSecure,
  onChangeText,
  isRequired,
  onPress,
  btnStyle,
  isLabelRequired = true,
  mainContainerProps,
  error,
  editable = true,
  crossTrue,
  maxLengthTitle,
  showAddButton,
  onAddPress,
  currentValue = 0,
  defaultValue,
  textInputBackgroundColor,
  onChangeCountry,
  onChangeFormattedText,
  customLabelStyle,
  defaultCountryCode,
  ...props
}: any) => {
  const phoneInput = useRef<PhoneInput>(null);
  const [countryCode, setCountryCode] = useState(defaultCountryCode || '44');
  const [countryISOCode, setCountryISOCode] = useState(
    getCountryCodeFromCallingCode(defaultCountryCode || '44'),
  );
  // Stable key that only changes when country code changes, not on every value change
  const [componentKey, setComponentKey] = useState(`phone-input-${Date.now()}`);

  useEffect(() => {
    if (defaultCountryCode) {
      setCountryCode(defaultCountryCode);
      setCountryISOCode(getCountryCodeFromCallingCode(defaultCountryCode));
      // Only update key when country code changes (address data loads)
      setComponentKey(`phone-input-${defaultCountryCode}-${Date.now()}`);
    }
  }, [defaultCountryCode]);

  return (
    <View style={[styles.container, mainContainerProps]}>
      {isLabelRequired && (
        <View style={styles.labelContainer}>
          <Text style={[styles.labelStyle, customLabelStyle]}>{label}</Text>
          {maxLengthTitle && (
            <Text
              style={
                styles.wordLabelStyle
              }>{`${currentValue}/${maxLengthTitle}`}</Text>
          )}
        </View>
      )}
      <View style={[styles.inputContainer, btnStyle]}>
        <PhoneInput
          key={componentKey}
          ref={phoneInput}
          value={value}
          defaultCode={countryISOCode as any}
          layout="first"
          onChangeText={text => {
            const cleanText = text.replace(/\D/g, '').slice(0, 10);
            onChangeText(cleanText);
          }}
          onChangeFormattedText={text => {
            if (onChangeFormattedText) {
              onChangeFormattedText(text);
            }
          }}
          onChangeCountry={country => {
            if (
              country &&
              Array.isArray(country.callingCode) &&
              country.callingCode.length > 0
            ) {
              setCountryCode(country.callingCode[0]);
            } else {
              console.warn('Missing or invalid calling code:', country);
              setCountryCode('');
            }
            if (onChangeCountry) {
              onChangeCountry(country);
            }
          }}
          textInputStyle={styles.input}
          flagButtonStyle={styles.flagStyle}
          containerStyle={styles.inputContainer2}
          textContainerStyle={styles.textContainer}
          codeTextStyle={styles.codeTextStyle}
          textInputProps={{
            keyboardType: 'number-pad',
            cursorColor: Colors.grey,
            placeholderTextColor: Colors.grey,
            maxLength: 10,
          }}
          renderDropdownImage={
            <View>
              <Text style={styles.contryCodeText}>+{countryCode}</Text>
            </View>
          }
        />
      </View>
      {error && <Text style={styles.errorStyle}>{error}</Text>}
    </View>
  );
};

export default MobileNumInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgba(164, 163, 163, 0.33)',
  },
  inputStyle: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    height: 45,
    fontFamily: fonts['Poppins-Regular'],
    fontSize: fontSize.f14,
  },
  labelStyle: {
    color: '#EEEEEE',
    fontFamily: fonts['Poppins-SemiBold'],
    fontSize: fontSize.f14,
    marginBottom: 3,
  },
  errorStyle: {
    color: Colors.red,
    fontFamily: fonts['Poppins-Regular'],
    fontSize: fontSize.f12,
    marginTop: 10,
    marginLeft: 10,
  },
  requiredStyle: {
    marginLeft: 2,
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.red,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  eyeStyle: {
    paddingHorizontal: 16,
  },
  wordLabelStyle: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: '#666666',
    marginLeft: 2,
  },
  addTextStyle: {
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f14,
  },
  rowStyle: {
    height: 20,
    width: 2,
    marginRight: 10,
  },

  input: {
    height: 50,
    color: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  flagStyle: {
    height: 50,
    width: 50,
    marginRight: 7,
    borderRadius: 8,
  },
  inputContainer2: {
    height: 50,
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  textContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    borderRadius: 8,
  },
  codeTextStyle: {
    display: 'none',
  },
  contryCodeText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
});
