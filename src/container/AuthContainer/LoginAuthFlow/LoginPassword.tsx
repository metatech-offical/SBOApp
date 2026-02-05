import React, {useEffect, useState} from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {fonts} from '@constant/fontfamily';
import {LoginPasswordProps} from '@navigation/screens';
import CustomButton from '@components/CustomButtons/CustomButton';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {getMessaging} from '@react-native-firebase/messaging';
import {useLoginMutation} from '@rtkServices/AuthService';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
import SafeAreaWrapper from '@components/ScreenLayouts/SafeAreaWrapper';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
interface IOtpFormReq {
  password: string;
}
const LoginPassword = ({navigation, route}: LoginPasswordProps) => {
  const {showError, showSuccess} = useToastMessage();
  const {email} = route?.params || {};
  const [isSecure, setIsSecure] = useState(true);
  const onEyePress = () => setIsSecure(prev => !prev);
  const [deviceToken, setDeviceToken] = useState('');
  const [login, {isLoading}] = useLoginMutation();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const deviceToken = await getMessaging().getToken();
    setDeviceToken(deviceToken);
  };

  const {control, handleSubmit, watch} = useForm<IOtpFormReq>({
    defaultValues: {
      password: '',
    },
  });

  const password = watch('password');

  const handeLogin = async (data: IOtpFormReq) => {
    const payload = {
      loginIdentifier: email,
      password: data.password,
      deviceInfo: {
        platform: Platform.OS,
        fcmToken: deviceToken,
        OSVersion: Platform.Version,
      },
    };
    await login(payload)
      .then(res => {
        if (res?.data?.success) {
          // showSuccess(res?.data?.message || '');
          navigation.reset({
            index: 0,
            routes: [{name: 'MainNavigator'}],
          });
        }
        if (res?.error) {
          showError(
            res?.error?.data?.message ||
              res?.error?.message ||
              'Something went wrong',
          );
        }
      })
      .catch(err => {
        console.log('err --------> ', JSON.stringify(err, null, 2));
      });
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Enter your password</Text>
        </View>
        <View>
          <Controller
            control={control}
            rules={{
              required: 'Password field is required',
            }}
            name={'password'}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <TextInputWithLabels
                value={value}
                placeholder="Password"
                btnStyle={styles.input}
                isSecure={isSecure}
                onPress={onEyePress}
                onChangeText={(text: string) => onChange(text)}
                keyboardType="default"
                error={error?.message}
              />
            )}
          />
          <CustomButton
            text="Continue"
            onPress={handleSubmit(handeLogin)}
            isLoading={isLoading}
            disabled={!password || password.length < 8}
            btnStyle={
              !password || password.length < 8
                ? {opacity: 0.5}
                : {opacity: 1, backgroundColor: '#ffffff'}
            }
            textStyle={
              !password || password.length < 8
                ? {color: 'rgba(255, 255, 255, 0.5)'}
                : {color: Colors.black}
            }
          />
        </View>
        <View style={styles.bottomContainer}>
          <Pressable
            style={styles.backContainer}
            onPress={() => navigation.goBack()}>
            <BackArrow stroke={Colors.grey} fill={Colors.grey} />
            <Text style={styles.bottomText}>Back</Text>
          </Pressable>
          <View style={styles.signInForgotContainer}>
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={styles.bottomText}>Sign in</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.bottomText}>Forgot Password</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};
export default LoginPassword;
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
    justifyContent: 'space-between',
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
  input: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderWidth: 0,
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  signInForgotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 20,
  },
});
