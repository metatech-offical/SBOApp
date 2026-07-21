import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {fonts} from '@constant/fontfamily';
import {SignUpMobileInputProps} from '@navigation/screens';
import CustomButton from '@components/CustomButtons/CustomButton';
import auth from '@react-native-firebase/auth';
import SafeAreaWrapper from '@components/ScreenLayouts/SafeAreaWrapper';
import MobileNumInput from '@components/CustomInputs/MobileNumInput';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {useToastMessage} from '@hooks/useToastMessage';

interface ISignUpMobileInputFormReq {
  mobile: string;
}

const isPhoneReady = (formatted: string, national: string) => {
  const digits = (formatted || '').replace(/\D/g, '');
  // E.164 without +: country code + national number, typically 10–15 digits
  return digits.length >= 10 && digits.length <= 15 && national.length >= 7;
};

const SignUpMobileInput = ({navigation, route}: SignUpMobileInputProps) => {
  const {uuid} = route?.params || {};
  const [formattedLoginIdentifier, setFormattedLoginIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {showError, showSuccess} = useToastMessage();
  const {control, handleSubmit, watch} = useForm<ISignUpMobileInputFormReq>({
    defaultValues: {
      mobile: '',
    },
  });
  const mobile = watch('mobile');
  const canContinue = isPhoneReady(formattedLoginIdentifier, mobile);

  const formatPhoneNumber = (number: string) => {
    if (number.startsWith('+')) return number;
    return `+91${number}`;
  };

  const handleSignUpSubmit = async (data: ISignUpMobileInputFormReq) => {
    setIsLoading(true);
    const formattedNumber =
      formattedLoginIdentifier || formatPhoneNumber(data?.mobile);

    try {
      const confirmationResult = await auth().signInWithPhoneNumber(
        formattedNumber,
      );
      showSuccess('OTP sent to your phone');
      navigation.navigate('EmailOtp', {
        type: 'mobile',
        confirmationResult: confirmationResult,
        email: '',
        uuid: uuid,
        mobile: formattedNumber,
      });
    } catch (error: any) {
      console.error('Error signing in:', error);
      showError(
        error?.message ||
          'Failed to send mobile OTP. Check Firebase Phone setup / SHA keys.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Add your</Text>
          <Text style={styles.title}>mobile</Text>
          <Text style={styles.subText}>
            Add your mobile for securing your account
          </Text>
        </View>
        <View>
          <Controller
            control={control}
            name="mobile"
            rules={{
              required: 'Mobile number is required',
            }}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <MobileNumInput
                value={value}
                isRequired
                onChangeText={(text: string) => {
                  onChange(text);
                }}
                onChangeCountry={(country: any) => {}}
                onChangeFormattedText={setFormattedLoginIdentifier}
                error={error?.message}
                keyboardType="phone-pad"
                autoCapitalize="none"
                textInputProps={{
                  maxLength: 15,
                }}
              />
            )}
          />
          <CustomButton
            text="Continue"
            onPress={handleSubmit(handleSignUpSubmit)}
            disabled={!canContinue}
            btnStyle={
              !canContinue
                ? {opacity: 0.5}
                : {opacity: 1, backgroundColor: '#ffffff'}
            }
            isLoading={isLoading}
            textStyle={
              !canContinue
                ? {color: 'rgba(255, 255, 255, 0.5)'}
                : {color: Colors.black}
            }
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default SignUpMobileInput;

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
  subText: {
    color: '#CACACA',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
  },
});
