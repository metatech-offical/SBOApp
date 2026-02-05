import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {fonts} from '@constant/fontfamily';
import {ForgotPasswordProps} from '@navigation/screens';
import CustomButton from '@components/CustomButtons/CustomButton';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
import {useForgotPasswordMutation} from '@rtkServices/AuthService';
import SafeAreaWrapper from '@components/ScreenLayouts/SafeAreaWrapper';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {useKeyboardVisibility} from '@utils/keyboardUtils';

const ForgotPassword = ({navigation}: ForgotPasswordProps) => {
  const {control, handleSubmit, watch} = useForm<ILoginFormReq>({
    defaultValues: {
      email: '',
    },
  });
  const [userForgotRequest, userForgotResponse] = useForgotPasswordMutation();
  const keyboardStatus = useKeyboardVisibility();
  const isFormComplete = !!watch('email');

  const {showError, showSuccess} = useToastMessage();

  const handleLoginSubmit = (data: ILoginFormReq) => {
    const payload = {
      email: data?.email,
    };
    userForgotRequest(payload).then((res: any) => {
      if (res.data) {
        showSuccess(res?.data?.message ?? '');
        navigation.navigate('ForgotOpt', {
          email: data?.email,
        });
      }
      if (res.error) {
        showError(
          res?.error?.data?.message
            ? res?.error?.data?.message
            : res?.error?.data,
        );
      }
    });
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subText}>
            No worries! Enter your email address below and we will send you a
            code to reset password.
          </Text>
        </View>

        <View style={{marginTop: 20}}>
          <Controller
            control={control}
            rules={{
              required: 'Email or Username field is required',
            }}
            name={'email'}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <TextInputWithLabels
                value={value}
                placeholder="Enter your email"
                onChangeText={(text: string) => onChange(text?.toLowerCase())}
                error={error?.message}
                keyboardType="default"
                autoCapitalize="none"
              />
            )}
          />
          <CustomButton
            text="Send Code"
            onPress={handleSubmit(handleLoginSubmit)}
            disabled={!isFormComplete}
            isLoading={userForgotResponse.isLoading}
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
        <View style={{height: keyboardStatus ? 70 : 0}} />
      </View>
    </SafeAreaWrapper>
  );
};

export default ForgotPassword;

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
    paddingHorizontal: 20,
    paddingTop: 20,
    borderWidth: 0.5,
    borderTopWidth: 1,
    borderColor: 'rgba(94, 94, 94, 0.5)',
  },
  titleContainer: {
    // paddingRight: 40,
  },
  title: {
    fontSize: 40,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    paddingRight: 40,
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
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  subText: {
    fontSize: fontSize.f12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: fonts['Poppins-Regular'],
    marginTop: 10,
  },
});
