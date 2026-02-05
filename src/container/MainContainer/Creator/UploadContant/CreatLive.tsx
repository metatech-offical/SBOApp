import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {fonts} from '@constant/fontfamily';
import CustomImagePicker from '@components/CustomImagePicker/ImagePicker';
import {Controller, useForm} from 'react-hook-form';
import {isEmpty} from 'lodash';
import {CrossIcon, BackArrow} from '@assets/svg/AuthFlowIcons';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import CustomDropDown from '@components/DropDown/CustomDropDown';
import CustomButton from '@components/CustomButtons/CustomButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import FastImage from 'react-native-fast-image';
import {useCreateLiveStreamMutation} from '@rtkServices/LiveStreamServices';
import {useUploadCoverImageMutation} from '@rtkServices/ShortsService';
import {CheckLiveStreamPermissions} from '@utils/permision';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SubscriptionTabs1, UploadCategoryData} from '@utils/data';
import {Colors} from '@constant/colors';
import {fontSize, width} from '@constant/fontSize';
import {useToastMessage} from '@hooks/useToastMessage';

interface ImageData {
  path?: string;
  uri?: string;
}

interface StreamToOption {
  id: number;
  label: string;
  value: string;
}

interface FormData {
  streamTo: string;
  currency: string;
  coverImage?: ImageData | string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string;
}

interface CreatLiveProps {
  navigation: NativeStackNavigationProp<any>;
}

const CreatLive: React.FC<CreatLiveProps> = ({navigation}) => {
  const {top} = useSafeAreaInsets();
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [isLoading, seIsLoading] = useState(false);
  const [streamImageData, setStreamImageData] = useState<
    ImageData | string | null
  >(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagError, setTagError] = useState<string>('');
  const [uploadImage] = useUploadCoverImageMutation();
  const [createLiveStream] = useCreateLiveStreamMutation();
  const {showError} = useToastMessage();
  const {control, watch, trigger, getValues} = useForm<FormData>({
    defaultValues: {
      streamTo: 'everyone',
    },
  });

  const streamToValue = watch('streamTo');
  const titleValue = watch('title');
  const descriptionValue = watch('description');
  const categoryValue = watch('category');

  // Check if all fields are filled
  const isAllFieldsFilled = useMemo(() => {
    if (currentStep === 1) {
      return (
        !!streamImageData &&
        !!titleValue?.trim() &&
        !!descriptionValue?.trim() &&
        !!categoryValue &&
        tags.length >= 1
      );
    } else {
      // Step 2 - streamTo has default value, so always filled
      return true;
    }
  }, [
    currentStep,
    streamImageData,
    titleValue,
    descriptionValue,
    categoryValue,
    tags.length,
  ]);

  const removeTag = useCallback((index: number) => {
    setTags(prev => prev.filter((_, key) => index !== key));
  }, []);
  const handleUpload = async (imageData: any) => {
    try {
      const result = await uploadImage(imageData).unwrap();
      const imageUrl = result?.data;
      if (imageUrl) {
        return imageUrl;
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleNext = useCallback(async () => {
    if (currentStep === 1) {
      const isValid = await trigger([
        'coverImage',
        'title',
        'description',
        'category',
        'tags',
      ]);
      if (isValid && tags.length >= 1) {
        setCurrentStep(2);
        scrollViewRef.current?.scrollTo({y: 0, animated: true});
      }
    } else {
      seIsLoading(true);
      const formData = getValues();
      const imgUrl = await handleUpload(streamImageData);
      const finalData = {
        ...formData,
        coverImage: imgUrl,
        tags: tags,
      };

      await handleCreateLiveStream(finalData);
    }
  }, [currentStep, tags, trigger, getValues, streamImageData]);

  const handleCreateLiveStream = async (finalData: any) => {
    try {
      console.log("finalDatafinalDatafinalDatafinalDatafinalDatafinalDatafinalData",finalData)
      // Check camera and microphone permissions before creating live stream
      const hasPermissions = await CheckLiveStreamPermissions();
      if (!hasPermissions) {
        return;
      }
      const payload = {
        title: finalData?.title,
        description: finalData?.description,
        category: finalData.category?.name,
        tags: finalData?.tags,
        thumbnailUrl: finalData?.coverImage,
      };
      const response = await createLiveStream(payload).unwrap();
      // console.log("createLiveStreamcreateLiveStreamcreateLiveStreamcreateLiveStream",response)
      navigation.navigate('LiveScreen', {formData: response.data});
    } catch (error) {
      seIsLoading(false);
      showError('Failed to create live stream:');
      console.log('Failed to create live stream:', error);
    } finally {
      seIsLoading(false);
    }
  };

  const handleBack = useCallback(() => {
    if (currentStep === 2) {
      setCurrentStep(1);
      // scrollViewRef.current?.scrollTo({y: 0, animated: true});
    } else {
      navigation.goBack();
    }
  }, [currentStep, navigation]);

  const renderStep1 = useCallback(
    () => (
      <View style={styles.stepContainer}>
        <Controller
          control={control}
          name={'coverImage'}
          rules={{
            validate: () => !!streamImageData || 'Cover image is required.',
          }}
          render={({fieldState: {error}}) => (
            <View style={{width: '100%', alignSelf: 'center'}}>
              {!isEmpty(streamImageData) ? (
                <View style={styles.imageWrapper}>
                  <ImageBackground
                    style={styles.imageBackgroundStyle}
                    imageStyle={{borderRadius: 10}}
                    source={{
                      uri:
                        typeof streamImageData === 'string'
                          ? streamImageData
                          : streamImageData?.path || streamImageData?.uri || '',
                    }}>
                    <View style={styles.rowViewStyle}>
                      <Pressable
                        style={styles.editPressStyle}
                        onPress={() => setPickerOpen(!pickerOpen)}
                        hitSlop={10}>
                        <Text style={[styles.buttonText, {fontSize: 14}]}>
                          Edit cover
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setStreamImageData(null)}
                        hitSlop={10}>
                        <CrossIcon color="#ffffff" />
                      </Pressable>
                    </View>
                  </ImageBackground>
                </View>
              ) : (
                <Pressable
                  onPress={() => setPickerOpen(!pickerOpen)}
                  hitSlop={20}
                  style={styles.imagePressStyle}>
                  <FastImage
                    source={require('@assets/images/galleryNewImage.png')}
                    style={styles.image}
                  />
                  <Text style={[styles.buttonText, {marginLeft: 10}]}>
                    Add cover image
                  </Text>
                </Pressable>
              )}
              {error && <Text style={styles.errorStyle}>{error.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          rules={{required: 'Title is required'}}
          name={'title'}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <TextInputWithLabels
              value={value}
              label="Title"
              placeholder="Write a catchy title"
              onChangeText={onChange}
              error={error?.message ?? ''}
              mainContainerProps={[styles.inputContainer, {marginTop: 20}]}
              maxLength={120}
              maxLengthTitle={120}
            />
          )}
        />

        <Controller
          control={control}
          rules={{required: 'Description is required'}}
          name={'description'}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <TextInputWithLabels
              value={value}
              label="Description"
              placeholder="Add a short description"
              onChangeText={onChange}
              error={error?.message ?? ''}
              multiline
              btnStyle={styles.bioButton}
              textAlignVertical="top"
              maxLength={200}
              maxLengthTitle={200}
              numberOfLines={5}
              height={90}
              mainContainerProps={styles.inputContainer}
            />
          )}
        />

        <Controller
          control={control}
          rules={{required: 'Category is required'}}
          name={'category'}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <CustomDropDown
              data={UploadCategoryData}
              placeHolder={'Category'}
              label={'Category'}
              isSearchable={true}
              onSelect={onChange}
              error={error?.message ?? ''}
            />
          )}
        />

        <Controller
          control={control}
          name={'tags'}
          rules={{
            validate: () => tags.length >= 1 || 'You must add at least 1 tag.',
          }}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <TextInputWithLabels
              value={value}
              label="Tags (minimum 1)"
              placeholder="Enter your own tags"
              onChangeText={(text: string) => onChange(text.replace(/\s/g, ''))}
              error={error?.message ?? tagError}
              mainContainerProps={[styles.inputContainer, {marginTop: 20}]}
              maxLengthTitle={6}
              minLengthTitle={tags?.length}
              showAddButton={true}
              onAddPress={() => {
                const trimmedValue = value?.trim();
                if (trimmedValue && tags?.length < 6) {
                  // Check if tag already exists (case-insensitive)
                  const isDuplicate = tags.some(
                    tag => tag.toLowerCase() === trimmedValue.toLowerCase()
                  );
                  
                  if (isDuplicate) {
                    showError('This tag already exists!');
                    return;
                  }
                  
                  setTags(prev => [...prev, trimmedValue]);
                  onChange('');
                  setTagError('');
                }
              }}
            />
          )}
        />

        {tags?.length > 0 && (
          <View style={styles.tagMainView}>
            {tags.map((tag: string, index: number) => (
              <View key={index} style={styles.tagViewStyle}>
                <Text style={styles.textStyle}>{tag}</Text>
                <TouchableOpacity onPress={() => removeTag(index)} hitSlop={20}>
                  <CrossIcon color="white" width={16} height={16} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    ),
    [streamImageData, tags, tagError, styles, control, removeTag],
  );

  const renderStep2 = useCallback(
    () => (
      <View style={styles.stepContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Visibility</Text>
          <Controller
            control={control}
            name="streamTo"
            render={({field: {onChange, value}}) => (
              <View style={styles.radioContainer}>
                {SubscriptionTabs1.map((option: StreamToOption) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.radioOption}
                    onPress={() => onChange(option.value)}
                    activeOpacity={0.7}>
                    <View style={styles.radioCircle}>
                      {value === option.value && (
                        <View style={styles.radioSelected} />
                      )}
                    </View>
                    <View style={styles.radioLabelContainer}>
                      <Text style={styles.radioTitle}>{option.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>
      </View>
    ),
    [streamToValue, styles, control],
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A0A47', '#100E12']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.headerContainer, {marginTop: top}]}>
        <TouchableOpacity
          style={styles.leftPart}
          onPress={handleBack}
          activeOpacity={0.7}>
          <BackArrow color="#ffffff" width={24} height={24} />
          <Text style={styles.pageNum}>Add details</Text>
        </TouchableOpacity>
        <View style={styles.rightPart}>
          <Text style={styles.pageNum}>{currentStep}/2</Text>
        </View>
      </View>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={100}
        keyboardOpeningTime={0}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {currentStep === 1 ? renderStep1() : renderStep2()}

        <CustomButton
          text={currentStep === 1 ? 'Next' : 'Create Stream'}
          onPress={handleNext}
          textStyle={[
            styles.buttonText,
            isAllFieldsFilled && styles.buttonTextFilled,
          ]}
          btnStyle={[
            styles.nextButton,
            isAllFieldsFilled && styles.nextButtonFilled,
          ]}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </KeyboardAwareScrollView>
      {pickerOpen && (
        <CustomImagePicker
          selectedCancel={() => setPickerOpen(!pickerOpen)}
          selectedValue={(item: ImageData | string) => {
            setPickerOpen(!pickerOpen);
            setStreamImageData(item);
          }}
        />
      )}
    </View>
  );
};

export default React.memo(CreatLive);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftPart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    columnGap: 10,
  },
  rightPart: {},
  pageNum: {
    fontSize: fontSize.f14,
    color: '#ffffff',
    fontFamily: fonts['Poppins-SemiBold'],
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 160,
  },
  stepContainer: {
    marginTop: 20,
    width: '100%',
    alignSelf: 'center',
  },
  // Step 1 styles
  imageWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageBackgroundStyle: {
    minHeight: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  rowViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  editPressStyle: {
    height: 30,
    width: 100,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 18,
    width: 18,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: fontSize.f13,
    fontFamily: fonts['Poppins-Medium'],
    textTransform: 'capitalize',
  },
  imagePressStyle: {
    minHeight: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagMainView: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tagViewStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  textStyle: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: fontSize.f13,
    fontFamily: fonts['Poppins-Medium'],
  },
  bioButton: {
    height: 100,
  },
  errorStyle: {
    color: Colors.red,
    fontFamily: fonts['Poppins-Regular'],
    fontSize: fontSize.f12,
    marginTop: 5,
  },
  inputContainer: {
    width: width - 25,
    alignSelf: 'center',
  },
  // Step 2 styles
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: fontSize.f16,
    color: '#ffffff',
    fontFamily: fonts['Poppins-SemiBold'],
    marginBottom: 10,
  },
  radioTitle: {
    fontSize: fontSize.f14,
    color: '#ffffff',
    fontFamily: fonts['Poppins-Medium'],
  },
  selectedRadioView: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
  },
  noRevenueText: {
    fontSize: fontSize.f12,
    color: '#8E8E93',
    fontFamily: fonts['Poppins-Regular'],
    fontStyle: 'italic',
  },
  dropdownContainer: {
    marginTop: 10,
  },
  nextButton: {
    marginTop: 30,
    marginBottom: 20,
  },
  nextButtonFilled: {
    backgroundColor: Colors.white,
  },
  buttonTextFilled: {
    color: Colors.black,
  },
  radioLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    columnGap: 10,
  },
  radioContainer: {
    rowGap: 15,
  },
  radioOption: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 4,
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelected: {
    height: 13,
    width: 13,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
});
