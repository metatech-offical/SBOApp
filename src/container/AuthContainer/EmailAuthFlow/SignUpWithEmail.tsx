import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {fonts} from '@constant/fontfamily';
import {SignUpWithEmailProps} from '@navigation/screens';
import CustomButton from '@components/CustomButtons/CustomButton';
import {useSignupMutation} from '@rtkServices/AuthService';

import SafeAreaWrapper from '@components/ScreenLayouts/SafeAreaWrapper';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const SignUpWithEmail = ({navigation}: SignUpWithEmailProps) => {
  const [signup, {isLoading}] = useSignupMutation();
  const {showSuccess, showError} = useToastMessage();

  const {control, handleSubmit, watch} = useForm<ILoginFormReq>({
    defaultValues: {
      email: '',
    },
  });
  const email = watch('email');

  const handleSignUpSubmit = async (data: ILoginFormReq) => {
    const payload = {
      email: data?.email,
    };
    const res = await signup(payload);
    if (res?.data?.success) {
      const debugOtp = (res?.data?.data as any)?.debugOtp;
      showSuccess(
        debugOtp
          ? `OTP (debug): ${debugOtp}`
          : res?.data?.message || '',
      );
      navigation.navigate('EmailOtp', {
        type: 'email',
        email: data?.email,
        confirmationResult: '',
        uuid: res?.data?.data?.uuid,
      });
    } else {
      const onboardingUser = res?.data?.data as IOnboardingUser | undefined;
      if (!onboardingUser) {
        const errorMessage =
          (res as any)?.error?.data?.message ||
          (res as any)?.error?.error ||
          'Unable to sign up. Check your connection and try again.';
        showError(errorMessage);
        return;
      }
      if (onboardingUser.verified) {
        showError((res as any)?.error?.data?.message || 'Account already exists');
        return;
      }

      if (
        onboardingUser.onboardingSteps.emailVerified &&
        !onboardingUser.onboardingSteps.phoneVerified
      ) {
        navigation.navigate('SignUpMobileInput', {uuid: onboardingUser?.uuid});
      }

      if (onboardingUser.onboardingSteps.phoneVerified && !onboardingUser.username) {
        navigation.navigate('TakeUserName', {uuid: onboardingUser?.uuid});
      }

      if (onboardingUser.username && !onboardingUser.membership) {
        navigation.navigate('CheckCreator', {uuid: onboardingUser?.uuid});
      }
    }
  };
  const isFormComplete = !!email;

  return (
    <SafeAreaWrapper>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Signup to get started</Text>
        </View>
        <View>
          <Controller
            control={control}
            rules={{
              required: 'Email field is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            }}
            name={'email'}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <TextInputWithLabels
                value={value}
                placeholder="hello@gmail.com"
                onChangeText={(text: string) => onChange(text?.toLowerCase())}
                error={error?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          <CustomButton
            text="Continue"
            onPress={handleSubmit(handleSignUpSubmit)}
            disabled={!isFormComplete}
            isLoading={isLoading}
            btnStyle={
              !isFormComplete
                ? {opacity: 0.5}
                : {opacity: 1, backgroundColor: '#ffffff'}
            }
            textStyle={
              !isFormComplete
                ? {color: 'rgba(255, 255, 255, 0.5)'}
                : {color: Colors.black}
            }
          />
        </View>
        <View style={styles.bottomContainer}>
          <Text
            style={styles.bottomText}
            onPress={() => navigation.replace('MobileFlowMobileInput')}>
            Signup with mobile instead
          </Text>
          <Text style={styles.bottomText} onPress={() => navigation.goBack()}>
            Log in
          </Text>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default SignUpWithEmail;

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
  titleContainer: {
    // : 20,
  },
  title: {
    fontSize: 40,
    color: '#ffffff',
    fontFamily: fonts['Poppins-Medium'],
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    columnGap: 20,
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
});
