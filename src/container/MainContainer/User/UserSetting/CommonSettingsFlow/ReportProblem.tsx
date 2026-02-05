import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import CustomRadioButton from '@components/CustomRadioButton/CustomRadioButton';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {ReportProblemProps} from '@navigation/screens';
import {ReportProblemData} from '@utils/data';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {fontSize, width} from '@constant/fontSize';
import FastImage from 'react-native-fast-image';
import CustomImagePicker from '@components/CustomImagePicker/ImagePicker';
import {CrossIconSimple2} from '@assets/svg/CommonIcons';
import CustomButton from '@components/CustomButtons/CustomButton';
import {useReportProblemMutation} from '@rtkServices/ProfileService';
import {useToastMessage} from '@hooks/useToastMessage';

const ReportProblem = ({navigation}: ReportProblemProps) => {
  const {showError, showSuccess} = useToastMessage();
  const {control, handleSubmit} = useForm();
  const [selected, setSelected] = useState<string>('');
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [imageData, setImageData] = useState<any[]>([]);
  const [reportProblemReq, reportProblemRes] = useReportProblemMutation();

  const handleChange = (data: any) => {
    setPickerOpen(!pickerOpen);
    const newImageData = [...(imageData || []), ...data];
    if (newImageData?.length > 3) {
      Alert.alert('Error', 'You can only upload a maximum of 3 images.');
    } else {
      setImageData(newImageData);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = imageData.filter((_, i) => i !== index);
    setImageData(updatedImages);
  };

  const onReportSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('category', selected);
      formData.append('message', data?.des);

      if (imageData && imageData?.length > 0) {
        imageData?.forEach((image, index) => {
          formData.append('files', {
            uri: Platform.OS === 'ios' ? image.sourceURL : image.path,
            type: image.mime,
            name: image.mime,
          });
        });
      }
      const response = await reportProblemReq(formData).unwrap();
      if (response.success) {
        showSuccess(response.message || 'Report submitted successfully');
        navigation.goBack();
      } else {
        showError(response.message || 'Failed to submit report');
      }
    } catch (error: any) {
      showError(error?.data?.message || 'Something went wrong');
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
          title="Report Problem"
          onBackPress={() => navigation.goBack()}
        />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>What problem are you reporting?</Text>
          <Text style={styles.subtitle}>
            Help us know more about the problem by selecting below:
          </Text>
          <CustomRadioButton
            data={ReportProblemData}
            selectedFilter={selected}
            onPress={item => setSelected(item?.value)}
            customTitleStyle={styles.radioTextStyle}
          />
          <Controller
            control={control}
            rules={{required: 'Description is required'}}
            name="des"
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Pressable
              onPress={() => setPickerOpen(!pickerOpen)}
              style={styles.uploadBtnStyle}>
              <FastImage
                source={require('@assets/images/gallaryImage.png')}
                style={{height: 20, width: 20}}
              />
              <Text style={styles.buttonText}>Upload</Text>
              <Text style={styles.buttonText}>({imageData?.length}/3)</Text>
            </Pressable>

            <FlatList
              data={imageData}
              horizontal
              renderItem={({item, index}) => (
                <View style={styles.viewStyle}>
                  <FastImage
                    source={{uri: item?.path}}
                    style={styles.imageStyle}
                  />
                  <Pressable
                    onPress={() => removeImage(index)}
                    style={styles.crossBtnStyle}>
                    <CrossIconSimple2
                      color={Colors.black}
                      width={10}
                      height={10}
                    />
                  </Pressable>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <CustomButton
            text="Submit"
            onPress={handleSubmit(onReportSubmit)}
            textStyle={[styles.buttonText, {color: Colors.black}]}
            isLoading={reportProblemRes?.isLoading}
            btnStyle={styles.buttonStyle}
          />
        </KeyboardAwareScrollView>
      </View>
      {pickerOpen && (
        <CustomImagePicker
          multiple
          selectedCancel={() => setPickerOpen(!pickerOpen)}
          selectedValue={(selectedImages: any) => {
            handleChange(selectedImages);
          }}
        />
      )}
    </View>
  );
};

export default ReportProblem;

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
  title: {
    fontSize: fontSize.f16,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    lineHeight: 20,
  },
  subtitle: {
    fontSize: fontSize.f14,
    color: Colors.grey,
    fontFamily: fonts['Poppins-Regular'],
    lineHeight: 20,
    marginTop: 10,
  },
  radioTextStyle: {
    color: Colors.white,
    fontFamily: fonts['Poppins-Regular'],
  },
  bioButton: {
    height: 100,
  },
  inputContainer: {
    width: width - 40,
    alignSelf: 'center',
    marginTop: 20,
  },
  uploadBtnStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 150,
    height: 45,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'space-evenly',
    marginLeft: 5,
  },
  crossBtnStyle: {
    position: 'absolute',
    top: -5,
    right: -5,
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    height: 40,
    width: 40,
    borderRadius: 5,
  },
  viewStyle: {
    position: 'relative',
    margin: 10,
  },
  buttonText: {
    color: Colors.white,
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
