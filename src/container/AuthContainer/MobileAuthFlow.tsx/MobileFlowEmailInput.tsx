import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {fonts} from '@constant/fontfamily';
import {MobileFlowEmailInputProps} from '@navigation/screens';
import CustomButton from '@components/CustomButtons/CustomButton';
import {useSignupMutation} from '@rtkServices/AuthService';
import SafeAreaWrapper from '@components/ScreenLayouts/SafeAreaWrapper';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const MobileFlowEmailInput = ({
  navigation,
  route,
}: MobileFlowEmailInputProps) => {
  const {uuid} = route?.params || {};
  const [signup, {isLoading}] = useSignupMutation();

  const {control, handleSubmit, watch} = useForm<ILoginFormReq>({
    defaultValues: {
      email: '',
    },
  });
  const email = watch('email');

  const {showError, showSuccess} = useToastMessage();

  const handleSignUpSubmit = async (data: ILoginFormReq) => {
    const payload = {
      email: data?.email,
      uuid: uuid,
    };
    const res = await signup(payload);
    if (res?.data?.success) {
      showSuccess(res?.data?.message || '');
      navigation.navigate('MobileOtp', {
        type: 'email',
        email: data?.email,
        confirmationResult: '',
      });
    }
    if (res?.error) {
      showError(res?.error?.data?.message);
      return;
    }
  };
  const isFormComplete = !!email;

  return (
    <SafeAreaWrapper>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Add your email</Text>
          <Text style={styles.subText}>
            Add your email for securing your account
          </Text>
        </View>
        <View>
          <Controller
            control={control}
            rules={{
              required: 'Email or Username field is required',
            }}
            name={'email'}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <TextInputWithLabels
                value={value}
                placeholder="hello@gmail.com"
                onChangeText={(text: string) =>
                  onChange(text?.toLowerCase()?.replace(/\s/g, ''))
                }
                error={error?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          <CustomButton
            text="Next"
            onPress={handleSubmit(handleSignUpSubmit)}
            disabled={!isFormComplete}
            isLoading={isLoading}
            btnStyle={{
              opacity: isFormComplete ? 1 : 0.5,
              backgroundColor: isFormComplete ? Colors.white : 'rgba(75, 71, 71, 0.5)',
            }}
            textStyle={{
              color: isFormComplete ? Colors.black : 'rgba(255, 255, 255, 0.5)',
            }}
          />
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>Signup with mobile instead</Text>
          <Text style={styles.bottomText} onPress={() => navigation.goBack()}>
            Log in
          </Text>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default MobileFlowEmailInput;

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
    fontSize: fontSize.f12,
    lineHeight: 20,
    marginVertical: 10,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
