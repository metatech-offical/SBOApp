import {View, Text, StyleSheet} from 'react-native';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import {DeleteAccountProps} from '@navigation/screens';
import {DeeteOptionData} from '@utils/data';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {fontSize, width} from '@constant/fontSize';
import {useEffect, useState} from 'react';
import CustomRadioButton from '@components/CustomRadioButton/CustomRadioButton';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {Controller, useForm} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '@components/CustomButtons/CustomButton';
import {useDeleteAccountMutation} from '@rtkServices/SettingsService';
import {RootState, useAppDispatch, useAppSelector} from '@store/index';
import {useToastMessage} from '@hooks/useToastMessage';
import {getMessaging} from '@react-native-firebase/messaging';
import {useLogoutMutation} from '@rtkServices/AuthService';
import {logoutUser} from '@store/UserManager';

const DeleteAccount = ({navigation}: DeleteAccountProps) => {
  const dispatch = useAppDispatch();
  const {showError, showSuccess} = useToastMessage();
  const {control, handleSubmit, setValue} = useForm();
  const [selectedDeleteType, setSelectedDeleteType] = useState<string>(
    DeeteOptionData[0]?.value || '',
  );
  const [logoutApi] = useLogoutMutation();
  const [useDeleteReq, useDeleteRes] = useDeleteAccountMutation();
  const {user} = useAppSelector((state: RootState) => state.user);
  const [deviceToken, setDeviceToken] = useState('');

  useEffect(() => {
    if (user?.username) {
      setValue('account_deleted', user?.username);
    }
  }, [user, setValue]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const deviceToken = await getMessaging().getToken();
    setDeviceToken(deviceToken);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.reset({
      index: 0,
      routes: [{name: 'AuthNavigator'}],
    });
  };

  const onLogoutApi = () => {
    const payload = {
      userId: user?._id,
      fcmToken: deviceToken,
    };
    console.log('payload', payload);
    handleLogout();
    logoutApi(payload).then((res: any) => {
      if (res?.data?.success) {
        handleLogout();
      }
      if (res?.error) {
        showError(res?.error?.data?.message || '');
      }
    });
  };

  const onDeleteAccount = (data: any) => {
    const payload = {
      category: selectedDeleteType,
      reason: data?.reason,
    };
    console.log('payload', payload);
    useDeleteReq(payload).then((res: any) => {
      if (res?.data) {
        onLogoutApi();
      }
      if (res?.error) {
        showError(
          res?.error?.data?.message
            ? res.error.data?.message
            : res?.error?.data || 'Delete account failed',
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <SettingHeader
          title="Delete Account"
          onBackPress={() => navigation.goBack()}
        />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.titleStyle}>
            We're sorry to hear that you would like to delete your account.
          </Text>
          <Text style={styles.subTitleStyle}>
            We'd like to know why you want to delete your account, so we can
            improve the app and support our community
          </Text>
          <View style={{marginTop: 10}}>
            <CustomRadioButton
              data={DeeteOptionData}
              selectedFilter={selectedDeleteType}
              onPress={(item: any) => setSelectedDeleteType(item?.value)}
              customTitleStyle={styles.radioTextStyle}
            />
          </View>
          <Controller
            control={control}
            rules={{required: 'Account Deleted is required'}}
            name="account_deleted"
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <TextInputWithLabels
                value={value}
                label="Account Deleted"
                placeholder="Account Deleted"
                onChangeText={onChange}
                error={error?.message}
                mainContainerProps={styles.inputContainer}
                editable={false}
              />
            )}
          />
          <Controller
            control={control}
            rules={{required: 'Bio is required'}}
            name="reason"
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <TextInputWithLabels
                value={value}
                label="Please give us more details"
                placeholder="Write message here..."
                onChangeText={onChange}
                error={error?.message}
                multiline
                btnStyle={styles.bioButton}
                maxLength={200}
                numberOfLines={5}
                height={90}
                mainContainerProps={[styles.inputContainer, {marginTop: 20}]}
              />
            )}
          />
          <CustomButton
            text="Delete Account"
            onPress={handleSubmit(onDeleteAccount)}
            textStyle={styles.buttonText}
            isLoading={useDeleteRes?.isLoading}
            btnStyle={styles.buttonStyle}
          />
          <Text style={styles.descriptiontextStyle}>
            Note: Deleting your will permanently erase all your content and
            personal information and will no longer be able to access your
            account.
          </Text>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
    paddingHorizontal: 16,
  },
  titleStyle: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },
  subTitleStyle: {
    color: Colors.grey,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    marginTop: 10,
  },
  radioTextStyle: {
    color: Colors.white,
    fontFamily: fonts['Poppins-Regular'],
    fontSize: fontSize.f12,
  },
  descriptiontextStyle: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    paddingHorizontal: 5,
    marginTop: 7,
    textAlign: 'center',
  },
  inputContainer: {
    width: width - 40,
    alignSelf: 'center',
    marginTop: 20,
  },
  bioButton: {
    height: 100,
  },
  buttonText: {
    color: Colors.black,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    textTransform: 'capitalize',
  },
  buttonStyle: {
    marginTop: 10,
    width: width - 40,
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
});
