import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {fonts} from '@constant/fontfamily';
import {LoginScreenProps} from '@navigation/screens';
import CustomButton from '@components/CustomButtons/CustomButton';
import SafeAreaWrapper from '@components/ScreenLayouts/SafeAreaWrapper';
import {Colors} from '@constant/colors';
import { fontSize } from '@constant/fontSize';

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const {control, handleSubmit, watch} = useForm<ILoginFormReq>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const email = watch('email');
  const handleLoginSubmit = (data: ILoginFormReq) => {
    setIsLoading(true);
    navigation.navigate('LoginPassword', {email: data?.email});
    setIsLoading(false);
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login to your account</Text>
        <View>
          <Controller
            control={control}
            rules={{
              required: 'Email field is required',
              validate: (value: string) => {
                // Only allow a valid email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                  return 'Email field is required';
                }
                if (emailRegex?.test(value)) {
                  return true;
                }
                return 'Enter a valid email address';
              },
            }}
            name={'email'}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <TextInputWithLabels
                value={value}
                placeholder="hello@gmail.com"
                onChangeText={(text: string) =>
                  onChange(text?.toLowerCase().replace(/\s/g, ''))
                }
                error={error?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          <CustomButton
            text="Continue"
            onPress={handleSubmit(handleLoginSubmit)}
            isLoading={isLoading}
            disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
            btnStyle={
              !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ? {opacity: 0.5}
                : {opacity: 1, backgroundColor: Colors.white}
            }
            textStyle={
              !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ? {color: 'rgba(255, 255, 255, 0.5)'}
                : {color: Colors.black}
            }
          />
        </View>
        <View style={styles.bottomContainer}>
          <Pressable onPress={() => navigation.replace('LoginMobile')}>
            <Text style={styles.bottomText}>Login with mobile instead</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('SignUpWithEmail')}>
            <Text style={styles.bottomText}>Register</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: 'rgba(27, 27, 27, 0.3)',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderWidth: 0.5,
    borderTopWidth: 1,
    borderColor: 'rgba(94, 94, 94, 0.5)',
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
    columnGap: 20,
  },
  bottomText: {
    fontSize: fontSize.f12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: fonts['Poppins-Regular'],
    textDecorationLine: 'underline',
  },
});
