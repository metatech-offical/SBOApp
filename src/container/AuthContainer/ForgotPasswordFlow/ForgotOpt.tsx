import React, {useRef, useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {fonts} from '@constant/fontfamily';
import {ForgotOptProps} from '@navigation/screens';
import {BackArrow, ClockIcon} from '@assets/svg/AuthFlowIcons';
import CustomButton from '@components/CustomButtons/CustomButton';
import {useVerifyOtpMutation} from '@rtkServices/AuthService';
import SafeAreaWrapper from '@components/ScreenLayouts/SafeAreaWrapper';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

interface IOtpFormReq {
  otp: string;
}

const ForgotOpt = ({navigation, route}: ForgotOptProps) => {
  const {email} = route?.params || {};
  const inputRef = useRef<TextInput>(null);
  const pinCount = 4;
  const [userForgotReq, userForgotRes] = useVerifyOtpMutation();
  const {control, handleSubmit, watch} = useForm<IOtpFormReq>({
    defaultValues: {
      otp: '',
    },
  });

  const {showError, showSuccess} = useToastMessage();

  const otp = watch('otp');

  const handleOnPress = () => {
    inputRef?.current?.focus();
  };

  const handleOtpUpSubmit = async (data: IOtpFormReq) => {
    const payload = {
      email: email ?? '',
      otp: data?.otp,
    };
    userForgotReq(payload)
      .then((res: any) => {
        if (res?.data) {
          showSuccess(res?.data?.message ?? '');
          navigation.navigate('ResetPassword', {
            email: email,
            otp: data?.otp,
          });
        }
        if (res.error) {
          showError(res?.error?.data?.message ?? 'Unexpected error occurred');
        }
      })
      .catch(error => {
        showError(
          error?.response?.data?.message ??
            'An error occurred. Please try again.',
        );
        console.log('error', error);
      });
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subText}>
            Enter the code that we sent to your registered email id to reset
            your password
          </Text>
          <View style={styles.forRow}>
            <Text style={styles.subText}>
              Didn't get the code?{' '}
              <Text style={styles.textBold}>Resend it</Text>
            </Text>
            <Text style={styles.subText}>
              <ClockIcon /> 0s
            </Text>
          </View>
        </View>
        <View>
          <Controller
            control={control}
            rules={{
              required: 'OTP is required',
              minLength: {
                value: 4,
                message: 'OTP must be 4 digits',
              },
              maxLength: {
                value: 4,
                message: 'OTP must be 4 digits',
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
            disabled={!otp || otp.length !== 4}
            isLoading={userForgotRes.isLoading}
            btnStyle={{
              opacity: !otp || otp.length !== 4 ? 0.5 : 1,
              backgroundColor:
                !otp || otp.length !== 4 ? 'rgba(75, 71, 71, 0.5)' : '#ffffff',
            }}
            textStyle={{
              color:
                !otp || otp.length !== 4
                  ? 'rgba(255, 255, 255, 0.5)'
                  : Colors.black,
            }}
          />
        </View>
        <View style={styles.bottomContainer}>
          <Pressable
            style={styles.backContainer}
            onPress={() => navigation.goBack()}>
            <BackArrow
              stroke={Colors.grey}
              fill={Colors.grey}
              width={15}
              height={15}
            />
            <Text style={styles.bottomText}>Back</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default ForgotOpt;

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
  titleContainer: {},
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
    justifyContent: 'space-between',
    gap: 15,
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
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
  },
  textBold: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
    textDecorationLine: 'underline',
  },
  forRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
});
