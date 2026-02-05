import React, {useState} from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {fonts} from '@constant/fontfamily';
import {ResetPasswordProps} from '@navigation/screens';
import CustomButton from '@components/CustomButtons/CustomButton';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useResetPasswordMutation} from '@rtkServices/AuthService';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import {useKeyboardVisibility} from '@utils/keyboardUtils';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const ResetPassword = ({navigation, route}: ResetPasswordProps) => {
  const keyboardStatus = useKeyboardVisibility();
  const {email, otp} = route?.params || {};
  const [state, setState] = useState({
    isLoading: false,
    isSecureNewPassword: true,
    isSecureConfirmPassword: true,
  });
  interface ITakePasswordFormReq {
    password: string;
    confirmPassword: string;
  }

  const {showError, showSuccess} = useToastMessage();

  const [userResetRequest, userResetResponse] = useResetPasswordMutation();
  const {isSecureNewPassword, isSecureConfirmPassword} = state;
  const updateState = (data: any) => {
    setState(prevState => ({...prevState, ...data}));
  };
  const onEyePressNewPassword = () =>
    updateState({isSecureNewPassword: !isSecureNewPassword});
  const onEyePressConfirmPassword = () =>
    updateState({isSecureConfirmPassword: !isSecureConfirmPassword});

  const {control, handleSubmit, watch} = useForm<ITakePasswordFormReq>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const newPasswordValue = watch('password');
  const newPass = watch('password');
  const conPass = watch('confirmPassword');

  const isFormComplete = !!newPasswordValue && !!conPass && newPass === conPass;

  const handleLoginSubmit = async (data: ITakePasswordFormReq) => {
    const payload = {
      email: email ?? '',
      // otp: otp ?? '',
      newPassword: data?.confirmPassword,
    };
    userResetRequest(payload).then((res: any) => {
      if (res?.data) {
        showSuccess(res?.data?.message || '');
        navigation.reset({
          index: 0,
          routes: [{name: 'AuthNavigator'}],
        });
      } else {
        showError(res?.error?.data?.message || '');
      }
    });
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor="#1a1538"
        zIndex={0}
      />
      <View style={styles.logoContainer}>
        <FastImage
          source={require('@assets/images/appLogo2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.formContainer}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            {
              top:
                Platform.OS === 'android'
                  ? keyboardStatus
                    ? 90
                    : 190
                  : keyboardStatus
                  ? 200
                  : 230,
            },
            styles.contentContainer,
          ]}>
          <View style={styles.formContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Create a new password</Text>
            </View>
            <View>
              <Controller
                control={control}
                rules={{
                  required: 'Email or Username field is required',
                }}
                name={'password'}
                render={({field: {onChange, value}, fieldState: {error}}) => (
                  <TextInputWithLabels
                    value={value}
                    placeholder="Password"
                    isSecure={isSecureNewPassword}
                    onPress={onEyePressNewPassword}
                    secureTextEntry={isSecureNewPassword}
                    onChangeText={(text: string) => onChange(text)}
                    error={error?.message}
                    keyboardType="default"
                    // autoCapitalize="none"
                  />
                )}
              />

              <Controller
                control={control}
                rules={{
                  required: 'Email or Username field is required',
                }}
                name={'confirmPassword'}
                render={({field: {onChange, value}, fieldState: {error}}) => (
                  <TextInputWithLabels
                    value={value}
                    placeholder="Confirm Password"
                    btnStyle={styles.input}
                    isSecure={isSecureConfirmPassword}
                    onPress={onEyePressConfirmPassword}
                    secureTextEntry={isSecureConfirmPassword}
                    onChangeText={(text: string) => onChange(text)}
                    error={error?.message}
                    keyboardType="email-address"
                    // autoCapitalize="none"
                  />
                )}
              />
              <CustomButton
                text="Continue"
                onPress={handleSubmit(handleLoginSubmit)}
                disabled={!isFormComplete}
                isLoading={userResetResponse.isLoading}
                btnStyle={{
                  opacity: !isFormComplete ? 0.5 : 1,
                  backgroundColor: !isFormComplete
                    ? 'rgba(75, 71, 71, 0.5)'
                    : '#ffffff',
                }}
                textStyle={{
                  color: !isFormComplete
                    ? 'rgba(255, 255, 255, 0.5)'
                    : Colors.black,
                }}
              />
            </View>
            <TouchableOpacity
              hitSlop={20}
              style={styles.bottomContainer}
              onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.bottomText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1538',
  },
  titlestyle: {
    fontSize: fontSize.f18,
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
    height: 70,
    width: 150,
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
  titleContainer: {},
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
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
  },
  forRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
});
