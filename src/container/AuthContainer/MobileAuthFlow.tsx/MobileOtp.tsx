import React, {useEffect, useRef, useState} from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {fonts} from '@constant/fontfamily';
import {MobileOtpProps} from '@navigation/screens';
import CustomButton from '@components/CustomButtons/CustomButton';
import {
  useMobileSignupMutation,
  useResendOtpMutation,
  useVerifyEmailOtpMutation,
} from '@rtkServices/AuthService';
import {getMessaging} from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import SafeAreaWrapper from '@components/ScreenLayouts/SafeAreaWrapper';
import {useToastMessage} from '@hooks/useToastMessage';
import Timer from '@components/CustomInputs/Timer';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

interface IOtpFormReq {
  otp: string;
}

const MobileOtp = ({navigation, route}: MobileOtpProps) => {
  const {type, confirmationResult, email, mobile} = route?.params || {};
  const inputRef = useRef<TextInput>(null);
  const pinCount = type === 'email' ? 4 : 6;
  const [verifyEmailOtp, {isLoading}] = useVerifyEmailOtpMutation();
  const [deviceToken, setDeviceToken] = useState<string>('');
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [resendOtp, {isLoading: isResendOtpLoading}] = useResendOtpMutation();
  const [mobileSignup, {isLoading: isMobileSignupLoading}] =
    useMobileSignupMutation();
  const [currentConfirmationResult, setCurrentConfirmationResult] =
    useState(confirmationResult);
  const [isResendingMobileOtp, setIsResendingMobileOtp] = useState(false);

  const {showError, showSuccess} = useToastMessage();

  const {control, handleSubmit, watch} = useForm<IOtpFormReq>({
    defaultValues: {
      otp: '',
    },
  });
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const deviceToken = await getMessaging().getToken();
    setDeviceToken(deviceToken);
  };
  const otp = watch('otp');

  const handleOnPress = () => {
    inputRef?.current?.focus();
  };

  const handleOtpUpSubmit = async (data: IOtpFormReq) => {
    if (type === 'email') {
      const res = await verifyEmailOtp({
        otp: data.otp,
        email: email,
      });
      if (res?.data?.success) {
        showSuccess(res?.data?.message || '');
        navigation.navigate('TakeUserName', {uuid: res?.data?.data?.uuid});
      } else {
        showError(res?.error?.data?.message || '');
      }
    } else if (type === 'mobile') {
      try {
        if (!currentConfirmationResult) {
          console.error('confirmationResult is null or undefined');
          showError('Invalid confirmation result. Please try again.');
          return;
        }

        const userCredential = await currentConfirmationResult.confirm(
          data?.otp,
        );
        let idToken = await userCredential?.user?.getIdToken();
        const payload = {
          idToken: idToken,
          deviceInfo: {
            platform: Platform.OS,
            fcmToken: deviceToken,
            OSVersion: Platform.Version,
          },
        };
        const res = await mobileSignup(payload);
        const userData = res?.data?.data as IOnboardingUser;
        if (!userData) {
          return;
        }
        if (userData?.verified) {
          navigation.reset({
            index: 0,
            routes: [{name: 'AuthNavigator'}],
          });
          return;
        }

        if (!userData.onboardingSteps.emailVerified) {
          navigation.navigate('MobileFlowEmailInput', {uuid: userData?.uuid});
        }
        if (
          userData.onboardingSteps.emailVerified &&
          userData.username?.trim() === ''
        ) {
          navigation.navigate('TakeUserName', {uuid: userData?.uuid});
        }
        if (userData.username && !userData.membership) {
          navigation.navigate('CheckCreator', {uuid: userData?.uuid});
        }
      } catch (error) {
        console.error('Error in mobile OTP verification:', error);
        showError('Invalid OTP. Please try again.');
      }
    } else {
      showError('Something went wrong');
    }
  };

  const getOtpMessage = () => {
    return type === 'email'
      ? 'Enter the code that we sent to your email'
      : 'Enter the code that we sent to your mobile';
  };

  const handleResendOtp = async () => {
    if (type === 'email') {
      const res = await resendOtp({
        email: email,
      });
      if (res?.data?.success) {
        setIsTimerComplete(false);
        showSuccess(res?.data?.message || '');
      }
    } else if (type === 'mobile') {
      if (!mobile) {
        showError('Mobile number not found. Please go back and try again.');
        return;
      }
      setIsResendingMobileOtp(true);
      try {
        const newConfirmationResult = await auth().signInWithPhoneNumber(
          mobile,
        );
        setCurrentConfirmationResult(newConfirmationResult);
        setIsTimerComplete(false);
        showSuccess('OTP resent successfully');
      } catch (error) {
        console.error('Error resending mobile OTP:', error);
        showError('Failed to resend OTP. Please try again.');
      } finally {
        setIsResendingMobileOtp(false);
      }
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subText}>{getOtpMessage()}</Text>

          <View style={styles.forRow}>
            <Text style={styles.subText}>
              Didn't get the code?{' '}
              {isTimerComplete && (
                <Pressable onPress={handleResendOtp}>
                  <Text style={styles.textBold}>
                    {isResendingMobileOtp || isResendOtpLoading
                      ? 'Resending...'
                      : 'Resend it'}
                  </Text>
                </Pressable>
              )}
            </Text>
            {!isTimerComplete && (
              <Timer
                resetTimer={() => {}}
                onTimerComplete={() => {
                  setIsTimerComplete(true);
                }}
              />
            )}
          </View>
        </View>
        <View>
          <Controller
            control={control}
            rules={{
              required: 'OTP is required',
              minLength: {
                value: pinCount,
                message: `OTP must be ${pinCount} digits`,
              },
              maxLength: {
                value: pinCount,
                message: `OTP must be ${pinCount} digits`,
              },
            }}
            name="otp"
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <TextInput
                ref={inputRef}
                value={value}
                onChangeText={onChange}
                maxLength={pinCount}
                keyboardType="numeric"
                style={styles.hiddenInput}
                cursorColor="#ffffff"
              />
            )}
          />
          <Pressable style={styles.otpContainer} onPress={handleOnPress}>
            {Array(pinCount)
              .fill(0)
              .map((_, index) => {
                const isFocused = index === otp.length;
                return (
                  <View
                    key={index}
                    style={[styles.cell, isFocused && styles.cellFocused]}>
                    <Text style={styles.cellText}>{otp[index] || ''}</Text>
                  </View>
                );
              })}
          </Pressable>
          <CustomButton
            text="Continue"
            onPress={handleSubmit(handleOtpUpSubmit)}
            disabled={!otp || otp.length < pinCount || isLoading}
            isLoading={isLoading || isMobileSignupLoading}
            btnStyle={
              !otp || otp.length < pinCount
                ? {opacity: 0.5}
                : {opacity: 1, backgroundColor: '#ffffff'}
            }
            textStyle={
              !otp || otp?.length < pinCount
                ? {color: 'rgba(255, 255, 255, 0.5)'}
                : {color: Colors.black}
            }
          />
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText} onPress={() => navigation.goBack()}>
            Go back
          </Text>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: 'rgba(27, 27, 27, 0.3)',
    flexGrow: 1,
    paddingHorizontal: 35,
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
  hiddenInput: {
    width: 0,
    height: 0,
    position: 'absolute',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 30,
    marginBottom: 20,
  },
  cell: {
    width: 55,
    height: 55,
    borderRadius: 6,
    backgroundColor: 'rgba(94, 94, 94, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cellFocused: {
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  cellText: {
    fontSize: fontSize.f26,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
    textAlign: 'center',
  },
  subText: {
    color: '#CACACA',
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Regular'],
  },
  textBold: {
    color: Colors.white,
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
    textDecorationLine: 'underline',
  },
  forRow: {
    flexDirection: 'row',
  },  
});
export default MobileOtp;
