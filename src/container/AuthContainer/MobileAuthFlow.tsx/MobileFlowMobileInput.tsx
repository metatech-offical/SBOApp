import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {fonts} from '@constant/fontfamily';
import {MobileFlowMobileInputProps} from '@navigation/screens';
import CustomButton from '@components/CustomButtons/CustomButton';
import auth from '@react-native-firebase/auth';
import SafeAreaWrapper from '@components/ScreenLayouts/SafeAreaWrapper';
import {formatPhxoneNumber} from '@utils/general';
import MobileNumInput from '@components/CustomInputs/MobileNumInput';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

interface ISignUpMobileInputFormReq {
  mobile: string;
}

const MobileFlowMobileInput = ({navigation}: MobileFlowMobileInputProps) => {
  const [formattedLoginIdentifier, setFormattedLoginIdentifier] = useState('');
  const [loading, setLoading] = useState(false);

  const {control, handleSubmit} = useForm<ISignUpMobileInputFormReq>({
    defaultValues: {
      mobile: '',
    },
  });

  const handleSignUpSubmit = async (data: ISignUpMobileInputFormReq) => {
    const formattedNumber =
      formattedLoginIdentifier || formatPhxoneNumber(data?.mobile);

    setLoading(true);
    try {
      const confirmationResult = await auth().signInWithPhoneNumber(
        formattedNumber,
      );
      console.log('confirmationResult', confirmationResult);
      navigation.navigate('MobileOtp', {
        type: 'mobile',
        confirmationResult: confirmationResult,
        email: '',
        mobile: formattedNumber,
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Signup to get started</Text>
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
                  maxLength: 10,
                }}
              />
            )}
          />
          <CustomButton
            text="Continue"
            onPress={handleSubmit(handleSignUpSubmit)}
            disabled={!formattedLoginIdentifier || formattedLoginIdentifier.length !== 13}
            btnStyle={
              !formattedLoginIdentifier ||
              formattedLoginIdentifier.length !== 13
                ? {opacity: 0.5}
                : {opacity: 1, backgroundColor: '#ffffff'}
            }
            textStyle={
              !formattedLoginIdentifier ||
              formattedLoginIdentifier.length !== 13
                ? {color: 'rgba(255, 255, 255, 0.5)'}
                : {color: Colors.black}
            }
            isLoading={loading}
          />
        </View>
        <View style={styles.bottomContainer}>
          <Text
            style={styles.bottomText}
            onPress={() => navigation.replace('SignUpWithEmail')}>
            Signup with email instead
          </Text>
          <Text style={styles.bottomText} onPress={() => navigation.goBack()}>
            Log in
          </Text>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default MobileFlowMobileInput;

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
