import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {fonts} from '@constant/fontfamily';
import {TakePasswordProps} from '@navigation/screens';
import CustomButton from '@components/CustomButtons/CustomButton';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CrossIcon} from '@assets/svg/AuthFlowIcons';
import {useSaveUsernamePasswordMutation} from '@rtkServices/AuthService';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import {useKeyboardVisibility} from '@utils/keyboardUtils';
import {PASSWORD_LENGTH, PASSWORD_REGEX} from '@constant/auth';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const TakePassword = ({navigation, route}: TakePasswordProps) => {
  const {username, uuid} = route?.params || {};
  const keyboardStatus = useKeyboardVisibility();
  interface ITakePasswordFormReq {
    password: string;
    confirmPassword: string;
  }

  const {showError} = useToastMessage();

  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);
  const onPasswordEyePress = () => setIsPasswordSecure(!isPasswordSecure);
  const onConfirmPasswordEyePress = () =>
    setIsConfirmPasswordSecure(!isConfirmPasswordSecure);

  const [saveUsernamePassword, {isLoading}] = useSaveUsernamePasswordMutation();

  const {control, handleSubmit, watch} = useForm<ITakePasswordFormReq>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // Helper function to validate password
  const validatePassword = (value: string) => {
    if (!value) {
      return 'Password field is required';
    }
    if (value.length < PASSWORD_LENGTH.MIN) {
      return `Password must be at least ${PASSWORD_LENGTH.MIN} characters`;
    }
    if (value.length > PASSWORD_LENGTH.MAX) {
      return `Password must be at most ${PASSWORD_LENGTH.MAX} characters`;
    }
    if (!PASSWORD_REGEX.test(value)) {
      return 'Password must contain at least one special character';
    }
    return true;
  };

  const handleLoginSubmit = async (data: ITakePasswordFormReq) => {
    const payload = {
      uuid: uuid,
      username: username,
      password: data?.confirmPassword,
    };
    const res = await saveUsernamePassword(payload);
    if (res?.data?.success) {
      navigation.navigate('CheckCreator', {uuid: uuid});
    } else {
      showError(res?.error?.data?.message || '');
    }
  };

  // Check if form is valid
  const isFormValid =
    password &&
    confirmPassword &&
    password === confirmPassword &&
    password.length >= PASSWORD_LENGTH.MIN &&
    password.length <= PASSWORD_LENGTH.MAX &&
    PASSWORD_REGEX.test(password);

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor="#1a1538"
        zIndex={0}
      />
      <View style={styles.logoContainer}>
        <FastImage
          source={require('@assets/images/appLogo-transparent.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.formContainer}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            {top: keyboardStatus ? 30 : 200},
            styles.contentContainer,
          ]}>
          <View style={styles.formContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Create a password</Text>
            </View>
            <View>
              <Controller
                control={control}
                rules={{
                  validate: validatePassword,
                }}
                name={'password'}
                render={({field: {onChange, value}, fieldState: {error}}) => (
                  <TextInputWithLabels
                    value={value}
                    placeholder="Password"
                    btnStyle={styles.input}
                    isSecure={isPasswordSecure}
                    onPress={onPasswordEyePress}
                    secureTextEntry={isPasswordSecure}
                    onChangeText={(text: string) => onChange(text)}
                    error={error?.message}
                    keyboardType="default"
                  />
                )}
              />
              {password && !PASSWORD_REGEX.test(password) && (
                <View style={styles.forRow}>
                  <CrossIcon stroke={Colors.red} fill={Colors.red} />
                  <Text style={styles.subText}>
                    At least one special character
                  </Text>
                </View>
              )}
              <Controller
                control={control}
                rules={{
                  required: 'Confirm Password field is required',
                  validate: value => {
                    if (password !== value) {
                      return 'Passwords do not match';
                    }
                    return true;
                  },
                }}
                name={'confirmPassword'}
                render={({field: {onChange, value}, fieldState: {error}}) => (
                  <TextInputWithLabels
                    value={value}
                    placeholder="Confirm Password"
                    btnStyle={styles.input}
                    isSecure={isConfirmPasswordSecure}
                    onPress={onConfirmPasswordEyePress}
                    secureTextEntry={isConfirmPasswordSecure}
                    onChangeText={(text: string) => onChange(text)}
                    error={error?.message}
                    keyboardType="default"
                  />
                )}
              />
              <CustomButton
                text="Continue"
                onPress={handleSubmit(handleLoginSubmit)}
                isLoading={isLoading}
                disabled={!isFormValid}
                btnStyle={
                  !isFormValid
                    ? {opacity: 0.5}
                    : {opacity: 1, backgroundColor: '#ffffff'}
                }
                textStyle={
                  !isFormValid
                    ? {color: 'rgba(255, 255, 255, 0.5)'}
                    : {color: Colors.black}
                }
              />
            </View>
            <View style={styles.bottomContainer}>
              <Text style={styles.bottomText}>Sign in</Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default TakePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1538',
  },
  titlestyle: {
    fontSize: fontSize.f18,
    color: Colors.black,
    fontFamily: fonts['Poppins-Medium'],
  },
  substyle: {
    fontSize: fontSize.f14,
    lineHeight: 20,
    marginTop: 10,
    fontFamily: fonts['Poppins-Regular'],
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  logo: {
    height: 100,
    width: 100,
  },
  forgotTextStyle: {
    fontSize: fontSize.f12,
    color: Colors.black,
    alignSelf: 'flex-end',
    fontFamily: fonts['Poppins-Regular'],
  },
  formContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: 'rgba(27, 27, 27, 0.3)',
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    borderWidth: 0.5,
    borderTopWidth: 1,
    borderColor: 'rgba(94, 94, 94, 0.5)',
  },
  titleContainer: {
    // : 20,
  },
  title: {
    fontSize: 40,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    columnGap: 3,
  },
  bottomText: {
    fontSize: fontSize.f12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: fonts['Poppins-Regular'],
    textDecorationLine: 'underline',
  },
  bottomText2: {
    fontSize: fontSize.f12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: fonts['Poppins-Regular'],
  },
  input: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderWidth: 0,
  },
  subText: {
    color: '#CACACA',
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Regular'],
  },
  forRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
});
