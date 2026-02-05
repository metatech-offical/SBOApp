import {
  View,
  StyleSheet,
  Pressable,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {Controller, useForm, useWatch} from 'react-hook-form';
import CustomDropDown from '@components/DropDown/CustomDropDown';
import {fonts} from '@constant/fontfamily';
import {isEmpty} from 'lodash';
import {CrossIcon} from '@assets/svg/AuthFlowIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {navigationRef} from '@navigation/utils';
import LinearGradient from 'react-native-linear-gradient';
import {ShortsUploadScreenProps} from '@navigation/screens';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import CustomButton from '@components/CustomButtons/CustomButton';
import {
  useGetShortPresignedUrlQuery,
  useUploadCroppCoverImageMutation,
} from '@rtkServices/ShortsService';
import {useCreateShortMutation} from '@rtkServices/ShortsService';
import FastImage from 'react-native-fast-image';
import {fontSize, width} from '@constant/fontSize';
import {SubscriptionTabs1, UploadCategoryData} from '@utils/data';
import {Colors} from '@constant/colors';
import {useToastMessage} from '@hooks/useToastMessage';
import {createThumbnail} from 'react-native-create-thumbnail';
import {getFirstThumbnailTimestamp} from '@utils/general';

interface StreamToOption {
  id: number;
  label: string;
  value: string;
}

export default function ShortsUploadScreen({
  navigation,
  route,
}: ShortsUploadScreenProps) {
  const {showError, showSuccess} = useToastMessage();
  const {data}: any = route?.params || {duration: 0, fileSize: 0, fileName: ''};
  const [imageData, setImageData] = useState<any>();
  const [coverTimestamp, setCoverTimestamp] = useState<number | null>(null);
  const {control, handleSubmit, setValue, watch} = useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  // Get video path/uri - support both new (uri) and old (path) formats
  const videoPath = data?.uri || data?.path;
  // Convert duration from milliseconds to seconds for API
  const duration = Math.floor((data?.duration || 0) / 1000);
  const {data: getShortPreUrl}: any = useGetShortPresignedUrlQuery({
    type: 'shorts',
  });
  const [uploadImage] = useUploadCroppCoverImageMutation();
  const [createShort] = useCreateShortMutation();

  const watchedValues = useWatch({control});
  const title = watchedValues?.title;
  const category = watchedValues?.category;
  const streamTo = watchedValues?.streamTo;

  // Restore form data when coming back from EditCoverScreen
  useEffect(() => {
    if (route?.params?.formData) {
      const {
        title,
        category,
        streamTo,
        tags: savedTags,
      } = route.params.formData;
      if (title) setValue('title', title);
      if (category) setValue('category', category);
      if (streamTo) setValue('streamTo', streamTo);
      if (savedTags && savedTags.length > 0) setTags(savedTags);
    }
  }, [route?.params?.formData]);

  const isFormValid = useMemo(() => {
    const hasImage = !isEmpty(imageData);
    const hasTitle = title && title.trim().length > 0;
    const hasCategory = category && category.name;
    const hasTags = tags && tags.length >= 1;
    const hasStreamTo = streamTo && streamTo.length > 0;

    return hasImage && hasTitle && hasCategory && hasTags && hasStreamTo;
  }, [imageData, title, category, tags, streamTo]);

  useEffect(() => {
    if (!route?.params?.selectedCover && videoPath && data?.duration) {
      const firstTimestamp = getFirstThumbnailTimestamp(data.duration);
      createVideoThumbnail(videoPath, firstTimestamp);
    }
  }, [data, videoPath]);

  useEffect(() => {
    if (route?.params?.selectedCover) {
      setImageData({path: route.params.selectedCover});
      setValue('image', {path: route.params.selectedCover});
      setCoverTimestamp(route.params.timestamp ?? null);
    }
  }, [route?.params?.selectedCover, route?.params?.timestamp]);

  const createVideoThumbnail = async (url: string, timeStamp: number) => {
    try {
      const result = await createThumbnail({
        url: url,
        format: 'png',
        timeStamp: timeStamp,
      });
      setImageData(result);
      setCoverTimestamp(timeStamp);
    } catch (error) {
      console.error('Create thumbnail failed:', error);
    }
  };

  const handleUpload = async (imageData: any) => {
    try {
      const result = await uploadImage({
        path: imageData.path,
        mime: imageData.mime || 'image/png',
        filename: imageData.filename || 'cover.png',
      }).unwrap();
      const imageUrl = result?.data;
      if (imageUrl) {
        return imageUrl;
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const uploadShort = async (formData: any) => {
    setIsUploading(true);
    const completeData = {
      ...formData,
      imageData: imageData,
      tags: tags,
      duration: duration,
    };
    try {
      const blob = await fetch(videoPath).then(res => res.blob());
      const uploadResponse = await fetch(getShortPreUrl?.data, {
        method: 'PUT',
        headers: {
          'Content-Type': data?.type || 'video/mp4',
        },
        body: blob,
      });
      const imgUrl = await handleUpload(imageData);
      if (uploadResponse.ok) {
        const payload = {
          tags: tags,
          videoUrl: getShortPreUrl?.data,
          description: completeData?.title,
          thumbnailUrl: imgUrl,
          duration: duration,
          category: completeData?.category?.name,
          visibility: watchedValues?.streamTo,
        };
        const createResponse = await createShort(payload).unwrap();
        setIsUploading(false);
        if (createResponse?.data) {
          showSuccess(createResponse?.data?.message || 'Uploaded Successfully');
          navigationRef.current?.reset({
            index: 0,
            routes: [
              {name: 'HomeScreen'},
              {
                name: 'ShortsFeed',
                params: {shortsId: createResponse?.data?._id},
              },
            ],
          });
        }
      } else {
        const errorMessage = await uploadResponse.text();
        throw new Error(`Upload failed: ${errorMessage}`);
      }
    } catch (error) {
      console.log('Upload or Create Short error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeTag = (index: number) => {
    setTags(prev => {
      return prev?.filter((_, key) => index != key);
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A0A47', '#100E12']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFillObject}
      />
      <StackHeader title="Add Detail" onBackPress={() => navigation.goBack()} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <View style={{padding: 12}}>
          {!isEmpty(imageData) ? (
            <View style={styles.imageWrapper}>
              {/* Main image layer */}
              <FastImage
                style={styles.imageMainLayer}
                resizeMode="contain"
                source={{
                  uri: imageData?.path ? imageData?.path : imageData,
                }}
              />

              {/* Close button in top right corner */}
              <View style={styles.closeButtonContainer}>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => {
                    setImageData(null);
                    setCoverTimestamp(null);
                  }}>
                  <CrossIcon color={'#ffffff'} size={18} />
                </Pressable>
              </View>

              {/* Edit button at bottom center */}
              <View style={styles.editButtonContainer}>
                <Pressable
                  style={styles.editButton}
                  onPress={() =>
                    navigation.navigate('EditCoverScreen', {
                      videoUrl: videoPath,
                      data: data,
                      currentCover: imageData?.path || imageData,
                      currentTimestamp: coverTimestamp,
                      screenType: 'shorts',
                      formData: {
                        title: watchedValues?.title,
                        category: watchedValues?.category,
                        streamTo: watchedValues?.streamTo,
                        tags: tags,
                      },
                    })
                  }>
                  <FastImage
                    source={require('@assets/images/galleryNewImage.png')}
                    style={{width: 16, height: 16}}
                    resizeMode="contain"
                  />
                  <Text style={styles.editButtonText}>Edit</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Controller
              control={control}
              rules={{required: 'Image is required'}}
              name={'image'}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <View style={styles.imgContainer}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate('EditCoverScreen', {
                        videoUrl: videoPath,
                        data: data,
                        screenType: 'shorts',
                        formData: {
                          title: watchedValues?.title,
                          category: watchedValues?.category,
                          streamTo: watchedValues?.streamTo,
                          tags: tags,
                        },
                      })
                    }
                    style={styles.imagePressStyle}>
                    <FastImage
                      source={require('@assets/images/gallaryImage.png')}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <Text style={[styles.buttonText, {fontSize: fontSize.f10}]}>
                      Add cover image
                    </Text>
                  </Pressable>
                  {error && (
                    <Text style={styles.errorStyle}>{error.message}</Text>
                  )}
                </View>
              )}
            />
          )}

          {/* Title Input */}
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

          {/* Category Dropdown */}
          <Controller
            control={control}
            rules={{required: 'Category is required'}}
            name={'category'}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <CustomDropDown
                data={UploadCategoryData || []}
                placeHolder={'Category'}
                label={'Category'}
                isSearchable={true}
                onSelect={onChange}
                error={error?.message ?? ''}
              />
            )}
          />
          <Text style={styles.commonTitle}>
            Content can be categorized for better search experience.
          </Text>

          {/* Tags Input */}
          <Controller
            control={control}
            name={'tags'}
            rules={{
              validate: value =>
                tags?.length >= 1 || 'You must add at least 1 tag.',
            }}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <TextInputWithLabels
                value={value}
                label="Tags (minimum 1)"
                placeholder="Enter your own tags"
                onChangeText={text => onChange(text.replace(/\s/g, ''))}
                error={error?.message ?? ''}
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
                  }
                }}
              />
            )}
          />

          {tags?.length > 0 && (
            <View style={styles.tagMainView}>
              {tags?.map((tag: string, index: number) => (
                <View key={index} style={styles.tagViewStyle}>
                  <Text style={styles.textStyle}>{tag}</Text>
                  <TouchableOpacity
                    hitSlop={20}
                    onPress={() => removeTag(index)}>
                    <CrossIcon color="white" width={16} height={16} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.sectionTitle}>Visibility</Text>
          <Controller
            control={control}
            name="streamTo"
            render={({field: {onChange, value}}) => (
              <View style={styles.radioContainer}>
                {SubscriptionTabs1?.map((option: StreamToOption) => (
                  <Pressable
                    key={option.id}
                    style={styles.radioOption}
                    onPress={() => onChange(option.value)}>
                    <View style={styles.radioCircle}>
                      {value === option.value && (
                        <View style={styles.radioSelected} />
                      )}
                    </View>
                    <View style={styles.radioLabelContainer}>
                      <Text style={styles.radioTitle}>{option.label}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={{padding: 12}}>
        <CustomButton
          text="Upload Short"
          onPress={handleSubmit(uploadShort)}
          textStyle={[
            styles.uploadButtonText,
            (isUploading || !isFormValid) && styles.disabledButtonText,
          ]}
          isLoading={isUploading}
          disabled={isUploading || !isFormValid}
          btnStyle={[
            styles.uploadButton,
            (isUploading || !isFormValid) && styles.disabledButton,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  inputContainer: {
    width: width - 25,
    alignSelf: 'center',
  },
  bioButton: {
    height: 100,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    textTransform: 'capitalize',
  },
  imagePressStyle: {
    minHeight: 260,
    height: 260,
    width: 160,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  imageWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: Colors.black,
    minHeight: 260,
    height: 260,
    width: 160,
    position: 'relative',
  },
  imageMainLayer: {
    width: 160,
    height: 260,
  },
  imageBackgroundStyle: {
    minHeight: 260,
    height: 260,
    width: 160,
    borderRadius: 8,
  },
  image: {
    height: 16,
    width: 16,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonContainer: {
    position: 'absolute',
    bottom: 110,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 30,
    gap: 8,
    width: 70,
    height: 30,
  },
  editButtonText: {
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f12,
  },
  commonTitle: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    marginTop: 10,
    marginRight: 50,
    color: Colors.grey,
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
  tagMainView: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  errorStyle: {
    color: Colors.red,
    fontFamily: fonts['Poppins-SemiBold'],
    fontSize: fontSize.f12,
  },
  imgContainer: {
    height: 260,
    width: 160,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
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
  radioLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    columnGap: 10,
  },
  radioContainer: {
    rowGap: 15,
    paddingHorizontal: 10,
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
  radioTitle: {
    fontSize: fontSize.f14,
    color: '#ffffff',
    fontFamily: fonts['Poppins-Medium'],
  },
  sectionTitle: {
    fontSize: fontSize.f16,
    color: '#ffffff',
    fontFamily: fonts['Poppins-SemiBold'],
    marginBottom: 10,
    marginTop: 20,
  },
  uploadButton: {
    backgroundColor: Colors.white,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  uploadButtonText: {
    color: Colors.black,
    fontFamily: fonts['Poppins-SemiBold'],
    fontSize: fontSize.f16,
  },
  disabledButtonText: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
});
