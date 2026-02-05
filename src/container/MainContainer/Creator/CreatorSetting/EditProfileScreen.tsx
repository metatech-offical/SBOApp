import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import {View, StyleSheet, Pressable, Platform, Text} from 'react-native';
import {EditProfileScreenProps} from '@navigation/screens';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Controller, useForm} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {fontSize, width} from '@constant/fontSize';
import CustomImagePicker from '@components/CustomImagePicker/ImagePicker';
import CustomButton from '@components/CustomButtons/CustomButton';
import {Colors} from '@constant/colors';
import {RootState, useAppDispatch, useAppSelector} from '@store/index';
import {fonts} from '@constant/fontfamily';
import {updateUser} from '@store/UserManager';
import {useUpdateProfileMutation} from '@rtkServices/ProfileService';
import {useToastMessage} from '@hooks/useToastMessage';

const EditProfileScreen = ({navigation}: EditProfileScreenProps) => {
  const {showError, showSuccess} = useToastMessage();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector((state: RootState) => state.user);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [imageData, setImageData] = useState<any>();
  const [updateProfile, updateProfileRes] = useUpdateProfileMutation();

  const {control, handleSubmit} = useForm({
    defaultValues: {
      username: user?.username,
      displayName: user?.displayName,
      bio: user?.bio,
    },
  });

  useEffect(() => {
    if (user?.profilePicture) {
      setImageData(user?.profilePicture);
    }
  }, [user]);

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (value) {
          formData.append(key, value);
        }
      }
      if (imageData) {
        formData.append('file', {
          uri:
            Platform.OS == 'ios'
              ? imageData?.sourceURL || imageData || ''
              : imageData?.path || imageData?.uri || imageData || '',
          type: imageData?.mime || 'image/jpeg',
          name: 'profile.jpg',
        });
      }
      const response = await updateProfile(formData).unwrap();
      if (response.success) {
        dispatch(updateUser(response?.data));
        showSuccess(response?.message || '');
        navigation.goBack();
      } else {
        showError(response?.message || 'Profile update failed');
      }
    } catch (error: any) {
      showError(error?.data?.message || 'Profile update failed');
    }
  };

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <SettingHeader
          title="Edit Profile"
          onBackPress={() => navigation.goBack()}
        />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Pressable
            onPress={() => setPickerOpen(!pickerOpen)}
            style={styles.imageContainer}>
            {imageData ? (
              <FastImage
                style={styles.profileImage}
                source={{
                  uri: imageData?.path ? imageData?.path : imageData,
                }}
              />
            ) : (
              <FastImage
                source={require('@assets/images/DummyUserImage.png')}
                style={styles.image}
              />
            )}
            <Text style={styles.subTitleStyle}>Change Photo</Text>
          </Pressable>
          <View style={{marginTop: 20}}>
            <Controller
              control={control}
              // rules={{
              //   required: 'Username is required',
              //   pattern: {
              //     value: /^[a-zA-Z0-9._]+$/,
              //     message:
              //       'Username can contain only letters, numbers, underscores and periods.',
              //   },
              // }}
              name="username"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  value={value}
                  label="Username"
                  placeholder="Username"
                  onChangeText={onChange}
                  maxLength={30}
                  maxLengthTitle={30}
                  error={error?.message}
                  mainContainerProps={styles.inputContainer}
                />
              )}
            />
            <Controller
              control={control}
              // rules={{required: 'Display Name is required'}}
              name="displayName"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  value={value}
                  label="Display Name"
                  placeholder="Full Name"
                  onChangeText={onChange}
                  maxLength={30}
                  maxLengthTitle={30}
                  error={error?.message}
                />
              )}
            />
            <Controller
              control={control}
              // rules={{required: 'Bio is required'}}
              name="bio"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  value={value}
                  label="Bio"
                  placeholder="Add a short bio describing yourself"
                  onChangeText={onChange}
                  error={error?.message}
                  multiline
                  btnStyle={styles.bioButton}
                  maxLength={200}
                  maxLengthTitle={200}
                  numberOfLines={5}
                  height={90}
                  mainContainerProps={styles.inputContainer}
                />
              )}
            />
          </View>
          <CustomButton
            text="Save"
            onPress={handleSubmit(onSubmit)}
            btnStyle={{backgroundColor: Colors.white}}
            textStyle={{color: Colors.black}}
            isLoading={updateProfileRes?.isLoading}
          />
        </KeyboardAwareScrollView>
      </View>
      {pickerOpen && (
        <CustomImagePicker
          selectedCancel={() => setPickerOpen(!pickerOpen)}
          selectedValue={(item: any) => {
            setPickerOpen(!pickerOpen);
            setImageData(item);
          }}
        />
      )}
    </View>
  );
};

export default EditProfileScreen;
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
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    minHeight: 120,
    minWidth: 120,
    borderRadius: 80,
  },
  profileImage: {
    minHeight: 120,
    minWidth: 120,
    borderRadius: 80,
  },
  inputContainer: {
    width: width - 40,
    alignSelf: 'center',
  },
  bioButton: {
    height: 100,
  },
  subTitleStyle: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    textAlign: 'center',
    marginTop: 20,
  },
});
