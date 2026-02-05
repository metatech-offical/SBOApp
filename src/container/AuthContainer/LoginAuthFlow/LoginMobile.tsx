import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {fonts} from '@constant/fontfamily';
import {LoginMobileProps} from '@navigation/screens';
import CustomButton from '@components/CustomButtons/CustomButton';
import SafeAreaWrapper from '@components/ScreenLayouts/SafeAreaWrapper';
import MobileNumInput from '@components/CustomInputs/MobileNumInput';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
interface ISignUpMobileInputFormReq {
  mobile: string;
}

const LoginMobile = ({navigation}: LoginMobileProps) => {
  const [formattedLoginIdentifier, setFormattedLoginIdentifier] = useState('');

  const {control, handleSubmit} = useForm<ISignUpMobileInputFormReq>({
    defaultValues: {
      mobile: '',
    },
  });
  const formatPhoneNumber = (number: string) => {
    if (number.startsWith('+')) return number;
    return `+91${number}`;
  };
  const handleSignUpSubmit = async (data: ISignUpMobileInputFormReq) => {
    const formattedNumber =
      formattedLoginIdentifier || formatPhoneNumber(data?.mobile);
    navigation.navigate('LoginPassword', {
      email: formattedNumber,
    });
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Login to your account</Text>
        </View>
        <View>
          <Controller
            control={control}
            name="mobile"
            rules={{
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit mobile number',
              },
              required: 'Mobile number is required',
            }}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <MobileNumInput
                value={value}
                isRequired
                onChangeText={(text: string) => {
                  const cleanText = text.replace(/\D/g, '').slice(0, 10);
                  onChange(cleanText);
                }}
                onChangeCountry={(country: any) => {}}
                onChangeFormattedText={setFormattedLoginIdentifier}
                error={error?.message}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
            )}
          />
          <CustomButton
            text="Continue"
            onPress={handleSubmit(handleSignUpSubmit)}
            btnStyle={
              !formattedLoginIdentifier
                ? {opacity: 0.5}
                : {opacity: 1, backgroundColor: '#ffffff'}
            }
            textStyle={
              !formattedLoginIdentifier
                ? {color: 'rgba(255, 255, 255, 0.5)'}
                : {color: Colors.black}
            }
            disabled={!formattedLoginIdentifier}
          />
        </View>
        <View style={styles.bottomContainer}>
          <Text
            style={styles.bottomText}
            onPress={() => navigation.replace('LoginScreen')}>
            Login with email instead
          </Text>
          <Text
            style={styles.bottomText}
            onPress={() => navigation.navigate('SignUpWithEmail')}>
            Register
          </Text>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default LoginMobile;

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
    color: Colors.white,
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
  subText: {
    color: '#CACACA',
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Regular'],
  },
});
