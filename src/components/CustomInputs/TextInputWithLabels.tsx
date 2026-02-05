import {
  CrossIcon,
  EyeHideIcon1,
  EyeShowIcon,
  CheckIcon,
} from '@assets/svg/AuthFlowIcons';
import { Colors } from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import { fontSize } from '@constant/fontSize';
import React, {useRef, forwardRef, useImperativeHandle, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';

interface TextInputWithLabelsProps extends TextInputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  isSecure?: boolean;
  onChangeText?: (val: string) => void;
  onPress?: () => void;
  crossTrue?: boolean;
  onPressCross?: () => void;
  isLabelRequired?: boolean;
  mainContainerProps?: any;
  btnStyle?: any;
  icon?: React.ReactNode;
  iconStyle?: any;
  error?: string;
  labelTextStyle?: any;
  maxLengthTitle?: number;
  labelContainerStyle?: any;
  multiline?: boolean;
  numberOfLines?: number;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
  showValidationIcon?: boolean;
  isUsernameAvailable?: boolean;
  isCheckingUsername?: boolean;
  showAddButton?: boolean;
  onAddPress?: () => void;
  minLengthTitle?: number;
  // New prop to control capitalization behavior
  capitalizeFirst?: boolean;
}

const TextInputWithLabels = forwardRef(
  (props: TextInputWithLabelsProps, ref) => {
    const {
      label,
      value,
      placeholder,
      placeholderTextColor,
      isSecure,
      onPress,
      onChangeText,
      crossTrue,
      onPressCross,
      icon,
      iconStyle,
      error,
      mainContainerProps,
      isLabelRequired = true,
      labelContainerStyle,
      maxLengthTitle,
      labelTextStyle,
      btnStyle,
      showValidationIcon = false,
      isUsernameAvailable,
      isCheckingUsername,
      showAddButton,
      onAddPress,
      minLengthTitle,
      capitalizeFirst = true, // Default to false to maintain existing behavior
      ...rest
    } = props;

    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
    }));

    // Function to capitalize first letter
    const handleTextChange = (text: string) => {
      if (capitalizeFirst && text?.length > 0) {
        const capitalizedText = text?.charAt(0)?.toUpperCase() + text?.slice(1);
        onChangeText?.(capitalizedText);
      } else {
        onChangeText?.(text);
      }
    };

    const renderValidationIcon = () => {
      if (!showValidationIcon || !value || value?.length === 0) {
        return null;
      }

      if (isCheckingUsername) {
        return (
          <View style={styles.validationIconContainer}>
            <Text style={styles.loadingText}>...</Text>
          </View>
        );
      }

      if (isUsernameAvailable !== undefined) {
        return (
          <View style={styles.validationIconContainer}>
            {isUsernameAvailable ? (
              <CheckIcon size={19} color="#4CAF50" />
            ) : (
              <CrossIcon size={19} color="#F44336" />
            )}
          </View>
        );
      }

      return null;
    };

    return (
      <View style={[styles.container, mainContainerProps]}>
        {isLabelRequired && (
          <View style={[styles.labelContainer, labelContainerStyle]}>
            {label && (
              <Text style={[styles.labelStyle, labelTextStyle]}>{label}</Text>
            )}
            {maxLengthTitle && (
              <Text style={styles.wordLabelStyle}>{`${
                minLengthTitle ? minLengthTitle : value?.length ?? 0
              }/${maxLengthTitle}`}</Text>
            )}
          </View>
        )}

        <View style={[styles.inputContainer, btnStyle]}>
          {icon && <View style={[styles.iconWrapper, iconStyle]}>{icon}</View>}

          <TextInput
            ref={inputRef}
            value={value}
            placeholder={placeholder}
            onChangeText={handleTextChange}
            autoCapitalize={capitalizeFirst ? 'sentences' : 'none'}
            secureTextEntry={isSecure}
            placeholderTextColor={placeholderTextColor || Colors.grey}
            style={[styles.inputStyle, rest.style]}
            {...rest}
          />
          {crossTrue && value && value.length > 0 && (
            <TouchableOpacity
              onPress={onPressCross}
              style={styles.crossIconContainer}>
              <CrossIcon size={19} color="#757380" />
            </TouchableOpacity>
          )}
          {renderValidationIcon()}
          {/* Add button functionality */}
          {showAddButton && (
            <View style={styles.addButtonContainer}>
              <View style={styles.rowStyle} />
              <TouchableOpacity
                onPress={onAddPress}
                style={styles.addButton}
                hitSlop={20}>
                <Text style={styles.addTextStyle}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
          {isSecure !== undefined && (
            <TouchableOpacity
              style={styles.eyeStyle}
              activeOpacity={0.5}
              onPress={e => {
                e.stopPropagation();
                onPress?.();
              }}>
              {isSecure === true ? (
                <EyeHideIcon1 color={Colors.grey} />
              ) : (
                <EyeShowIcon fill={Colors.grey} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {error && <Text style={styles.errorStyle}>{error}</Text>}
      </View>
    );
  },
);

export default TextInputWithLabels;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelStyle: {
    color: '#EEEEEE',
    fontSize: fontSize.f14,
    marginBottom: 5,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  wordLabelStyle: {
    fontSize: fontSize.f12,
    color: Colors.grey,
    fontFamily: fonts['Poppins-Regular'],
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgba(164, 163, 163, 0.33)',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 1.5},
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
  },
  iconWrapper: {
    paddingLeft: 8,
    paddingTop: 2,
  },
  inputStyle: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 7,
    borderRadius: 10,
    height: 43,
    color: Colors.white,
    fontFamily: fonts['Poppins-Regular'],
    paddingLeft: 15,
    fontSize: fontSize.f13,
  },
  crossIconContainer: {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    right: 8,
  },
  validationIconContainer: {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    right: 8,
  },
  eyeStyle: {
    paddingHorizontal: 16,
  },
  errorStyle: {
    color: Colors.red,
    fontSize: fontSize.f12,
    marginTop: 5,
    fontFamily: fonts['Poppins-Regular'],
  },
  loadingText: {
    color: '#FFA500',
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
  },
  // Add button styles
  addButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowStyle: {
    height: 20,
    backgroundColor: '#ffffff',
    width: 2,
    marginRight: 10,
  },
  addButton: {
    marginRight: 15,
  },
  addTextStyle: {
    color: '#ffffff',
    fontFamily: fonts['Poppins-SemiBold'],
    fontSize: fontSize.f14,
  },
});
