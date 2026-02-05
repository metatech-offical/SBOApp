import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {fonts} from '@constant/fontfamily';
import {TakeUserNameProps} from '@navigation/screens';
import CustomButton from '@components/CustomButtons/CustomButton';
import {debounce} from 'lodash';
import {useCheckUserValidOrNotMutation} from '@rtkServices/AuthService';
import SafeAreaWrapper from '@components/ScreenLayouts/SafeAreaWrapper';
import {USERNAME_LENGTH, USERNAME_REGEX} from '@constant/auth';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const TakeUserName = ({navigation, route}: TakeUserNameProps) => {
  const {uuid} = route?.params || {};
  interface ITakeUserNameFormReq {
    username: string;
  }
  const [checkUserReq, checkUserRes] = useCheckUserValidOrNotMutation();

  const {control, handleSubmit, watch} = useForm<ITakeUserNameFormReq>({
    defaultValues: {
      username: '',
    },
  });

  // State for username validation
  const [usernameCheckResult, setUsernameCheckResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const username = watch('username');

  const handleSearch = (query: string) => {
    debouncedSearch(query);
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query && query?.length > 0) {
        checkUsername(query);
      } else {
        setUsernameCheckResult(null);
      }
    }, 1000),
    [],
  );

  const checkUsername = async (name: string) => {
    setIsCheckingUsername(true);
    setUsernameCheckResult(null);

    const body = {username: name};
    try {
      const res = await checkUserReq(body).unwrap();
      setUsernameCheckResult({
        success: res.success,
        message: res.message,
      });
    } catch (err) {
      console.error('Username check error:', err);
      setUsernameCheckResult({
        success: false,
        message: 'Error checking username availability',
      });
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleLoginSubmit = (data: ITakeUserNameFormReq) => {
    navigation.navigate('TakePassword', {username: data?.username, uuid: uuid});
  };

  const isFormComplete = !!username && usernameCheckResult?.success;

  return (
    <SafeAreaWrapper>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Grab your username</Text>
        </View>
        <View>
          <Controller
            control={control}
            rules={{
              required: 'Username field is required',
              minLength: {
                value: USERNAME_LENGTH.MIN,
                message: `Username must be at least ${USERNAME_LENGTH.MIN} characters long`,
              },
              maxLength: {
                value: USERNAME_LENGTH.MAX,
                message: `Username cannot exceed ${USERNAME_LENGTH.MAX} characters`,
              },
              pattern: {
                value: USERNAME_REGEX,
                message:
                  'Username can only contain letters, numbers, underscores, and periods. It must not end with a special character.',
              },
            }}
            name={'username'}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <TextInputWithLabels
                btnStyle={styles.input}
                value={value}
                placeholder="Enter your username"
                onChangeText={(text: string) => {
                  const lowerText = text?.toLowerCase().replace(/\s/g, '');
                  onChange(lowerText);
                  handleSearch(lowerText);
                }}
                error={error?.message}
                autoCapitalize="none"
                showValidationIcon={true}
                isUsernameAvailable={usernameCheckResult?.success}
                isCheckingUsername={isCheckingUsername}
              />
            )}
          />

          {/* Username check result display */}
          {usernameCheckResult && !isCheckingUsername && (
            <Text
              style={[
                styles.checkResultText,
                {
                  color: usernameCheckResult.success ? '#4CAF50' : '#F44336',
                },
              ]}>
              {usernameCheckResult.message}
            </Text>
          )}

          <CustomButton
            text="Continue"
            onPress={handleSubmit(handleLoginSubmit)}
            disabled={!isFormComplete}
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
          <Text style={styles.bottomText} onPress={() => navigation.goBack()}>
            Go back
          </Text>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default TakeUserName;

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
  checkingText: {
    fontSize: fontSize.f12,
    color: '#FFA500',
    fontFamily: fonts['Poppins-Regular'],
    marginLeft: 10,
    marginTop: 5,
  },
  checkResultText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    marginLeft: 10,
    marginTop: 5,
  },
  input: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderWidth: 0,
  },
});
