import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useState, useMemo, useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import CustomDropDown from '@components/DropDown/CustomDropDown';
import {fonts} from '@constant/fontfamily';
import {CrossIcon} from '@assets/svg/AuthFlowIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {VideoUploadScreenProps} from '@navigation/screens';
import {fontSize, width} from '@constant/fontSize';
import {isEmpty} from 'lodash';
import {navigationRef} from '@navigation/utils';
import LinearGradient from 'react-native-linear-gradient';
import StackHeader from '@components/CustomHeaders/StackHeader';
import CustomButton from '@components/CustomButtons/CustomButton';
import FastImage from 'react-native-fast-image';
import {
  useGetShortPresignedUrlQuery,
  useUploadCroppCoverImageMutation,
} from '@rtkServices/ShortsService';
import {getFirstThumbnailTimestamp} from '@utils/general';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SubscriptionTabs1, UploadCategoryData} from '@utils/data';
import pLimit from 'p-limit';
import RNBlobUtil from 'react-native-blob-util';
import {
  useNewCreateStreamMutation,
  useNewInitiateVideoUploadMutation,
} from '@rtkServices/NewStreamService';
import {useToastMessage} from '@hooks/useToastMessage';
import {POST_UPLOAD_URL} from '@rtkServices/endpoints';
import {Colors} from '@constant/colors';
import {createThumbnail} from 'react-native-create-thumbnail';

interface StreamToOption {
  id: number;
  label: string;
  value: string;
}

export default function VideoUploadScreen({
  navigation,
  route,
}: VideoUploadScreenProps) {
  const {showError, showSuccess} = useToastMessage();
  const {data}: any = route?.params || {duration: 0, fileSize: 0, fileName: ''};
  const [imageData, setImageData] = useState<any>();
  const [coverTimestamp, setCoverTimestamp] = useState<number | null>(null);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: {errors},
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [isChunkedUpload, setIsChunkedUpload] = useState(false);
  const [uploadImage] = useUploadCroppCoverImageMutation();
  // Convert duration from milliseconds to seconds for API
  const duration = Math.floor((data?.duration || 0) / 1000);
  const [uploadProgress, setUploadProgress] = useState(0);
  const {data: getShortPreUrl}: any = useGetShortPresignedUrlQuery({
    type: 'streams',
  });
  const [newInitiateVideoUpload] = useNewInitiateVideoUploadMutation();
  const [createStream] = useNewCreateStreamMutation();
  const watchedValues = watch();
  const {title, description, category, streamTo} = watchedValues;
  const videoFilePath = data?.uri;
  const videofileSize = data?.fileSize;
  const ContentType = data?.type;
  const isLargeVideo = videofileSize > 100 * 1024 * 1024;

  const isFormValid = useMemo(() => {
    return (
      imageData &&
      title?.trim() &&
      description?.trim() &&
      category &&
      tags?.length >= 1 &&
      streamTo
    );
  }, [imageData, title, description, category, tags, streamTo]);

  useEffect(() => {
    if (!route?.params?.selectedCover && data?.uri && data?.duration) {
      const firstTimestamp = getFirstThumbnailTimestamp(data.duration);
      createVideoThumbnail(data.uri, firstTimestamp);
    }
  }, [data]);

  useEffect(() => {
    if (route?.params?.selectedCover) {
      setImageData({path: route.params.selectedCover});
      setValue('image', {path: route.params.selectedCover});
      setCoverTimestamp(route.params.timestamp ?? null);
    }
  }, [route?.params?.selectedCover, route?.params?.timestamp]);

  // Restore form data when coming back from EditCoverScreen
  useEffect(() => {
    if (route?.params?.formData) {
      const {
        title,
        description,
        category,
        streamTo,
        tags: savedTags,
      } = route.params.formData;
      if (title) setValue('title', title);
      if (description) setValue('description', description);
      if (category) setValue('category', category);
      if (streamTo) setValue('streamTo', streamTo);
      if (savedTags && savedTags.length > 0) setTags(savedTags);
    }
  }, [route?.params?.formData]);

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

  const initiateVideoUploadApi = async () => {
    const payload = {
      contentType: data?.type,
      fileName: data?.fileName,
    };
    try {
      const res = await newInitiateVideoUpload(payload);
      if (res && res?.data) {
        return res?.data?.data;
      } else {
        return res;
      }
    } catch (err) {
      console.log(err);
      return undefined;
    }
  };
  const PostMultuiUrl = async (uploadData: any) => {
    const payload = {
      uploadId: uploadData?.uploadId,
      key: uploadData?.key,
      fileSize: parseInt(data?.fileSize),
    };
    const token = await AsyncStorage.getItem('accessToken');
    try {
      const response = await fetch(POST_UPLOAD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result?.data) {
        return result?.data;
      }
    } catch (error) {
      console.error('Fetch failed:', error);
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
      showError('Upload failed');
    }
  };

  type PresignedUrlPart = {url: string; partNumber: number};
  type CompletedPart = {ETag: string; PartNumber: number};

  function normalizeFilePath(filePath: string): string {
    if (Platform.OS === 'ios' && filePath.startsWith('file://')) {
      return filePath.replace('file://', '');
    }
    return filePath;
  }

  function getHeaderCaseInsensitive(
    headers: Record<string, any>,
    name: string,
  ): string | undefined {
    const found = Object.keys(headers).find(
      k => k.toLowerCase() === name.toLowerCase(),
    );
    return found ? headers[found] : undefined;
  }

  const uploadFileStreamingApproach = async (
    contentType: string,
    filePath: string,
    fileSize: number,
    presignedUrls: PresignedUrlPart[],
    chunkSize: number,
    concurrency: number = 2,
    onProgress?: (uploadedBytes: number, total: number) => void,
  ): Promise<CompletedPart[]> => {
    let totalUploaded = 0;
    const limit = pLimit(concurrency);
    const uploadOnePart = async (part: PresignedUrlPart) => {
      const start = (part.partNumber - 1) * chunkSize;
      const end = Math.min(start + chunkSize, fileSize);
      const currentChunkSize = end - start;
      const tempChunkPath = `${RNBlobUtil.fs.dirs.CacheDir}/temp_chunk_${part.partNumber}.bin`;
      await RNBlobUtil.fs.slice(filePath, tempChunkPath, start, end);
      try {
        const response = await RNBlobUtil.fetch(
          'PUT',
          part.url,
          {'Content-Type': contentType},
          RNBlobUtil.wrap(tempChunkPath),
        );
        await RNBlobUtil.fs.unlink(tempChunkPath).catch(() => {});

        if (response.respInfo.status !== 200) {
          throw new Error(
            `Failed part ${part.partNumber}, status: ${response.info().status}`,
          );
        }

        const headers = response?.respInfo?.headers;
        const etag = getHeaderCaseInsensitive(headers, 'etag')?.replace(
          /"/g,
          '',
        );
        if (!etag) throw new Error(`ETag missing for part ${part.partNumber}`);

        totalUploaded += currentChunkSize;
        onProgress?.(totalUploaded, fileSize);

        return {ETag: etag, PartNumber: part.partNumber};
      } catch (err) {
        await RNBlobUtil.fs.unlink(tempChunkPath).catch(() => {});
        throw err;
      }
    };

    const completedParts = await Promise.all(
      presignedUrls.map(part => limit(() => uploadOnePart(part))),
    );

    return completedParts.sort((a, b) => a.PartNumber - b.PartNumber);
  };

  const uploadStream = async (pay_load: any) => {
    try {
      setLoading(true);
      setIsChunkedUpload(true);
      setUploadProgress(0);

      const uploadData = await initiateVideoUploadApi();

      const multiUrlRes = await PostMultuiUrl(uploadData);
      const normalizedFilePath = normalizeFilePath(videoFilePath);
      const completedParts = await uploadFileStreamingApproach(
        ContentType,
        normalizedFilePath,
        videofileSize,
        multiUrlRes.presignedUrls,
        multiUrlRes.chunkSize,
        3,
        (uploadedBytes: number) => {
          const progressPercentage = Math.round(
            (uploadedBytes / videofileSize) * 100,
          );
          setUploadProgress(progressPercentage);
        },
      );
      const token = await AsyncStorage.getItem('accessToken');
      const completeVideoRes = await fetch(
        'https://aimetastartsboserver-production.up.railway.app/v1/api/stream/videos/complete',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uploadId: multiUrlRes.uploadId,
            key: multiUrlRes.key,
            parts: completedParts,
          }),
        },
      );
      const data = await completeVideoRes.json();

      if (!uploadData) {
        throw new Error('Failed to get upload data');
      }

      let coverImageUrl = null;
      if (imageData) {
        coverImageUrl = await handleUpload(imageData);
      }
      const completeData = {
        ...pay_load,
        imageData: coverImageUrl,
        tags: tags,
        duration: data?.duration,
      };

      const payload = {
        type: 'video',
        status: 'uploaded',
        title: completeData?.title,
        url: data?.data?.location || '',
        thumbnailUrl: completeData?.imageData,
        description: completeData?.description,
        category: completeData?.category?.name,
        tags: completeData?.tags,
        duration: duration,
        visibility: watchedValues?.streamTo,
      };

      const createResponse = await createStream(payload).unwrap();

      if (createResponse?.data) {
        showSuccess('Video uploaded successfully');
        navigationRef.current?.reset({
          index: 0,
          routes: [{name: 'HomeScreen'}],
        });
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      showError('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
      setIsChunkedUpload(false);
      setUploadProgress(0);
    }
  };

  const uplpodShortStream = async (pay_load: any) => {
    setLoading(true);
    setUploadProgress(0);
    try {
      const imageUrl = await handleUpload(imageData);
      const completeData = {
        ...pay_load,
        imageData: imageUrl,
        tags: tags,
        duration: data?.duration,
      };
      const blob = await fetch(data?.uri).then(res => res.blob());
      const uploadResponse = await fetch(getShortPreUrl?.data, {
        method: 'PUT',
        headers: {
          'Content-Type': 'video/mp4',
        },
        body: blob,
      });
      if (uploadResponse.ok) {
        const payload = {
          type: 'video',
          status: 'uploaded',
          title: completeData?.title,
          url: getShortPreUrl?.data,
          thumbnailUrl: completeData?.imageData,
          description: completeData?.description,
          category: completeData?.category?.name,
          tags: completeData?.tags,
          duration: duration,
          visibility: watchedValues?.streamTo,
        };
        const createResponse = await createStream(payload).unwrap();

        if (createResponse?.data) {
          showSuccess('Video uploaded successfully');
          navigationRef.current?.reset({
            index: 0,
            routes: [{name: 'HomeScreen'}],
          });
        }
      } else {
        setLoading(false);
        const errorMessage = await uploadResponse.text();
        throw new Error(`Upload failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Upload video failed:', error);
      showError('Upload video failed');
      setLoading(false);
    } finally {
      setLoading(false);
      setIsChunkedUpload(false);
      setUploadProgress(0);
    }
  };

  const removoeTag = (index: number) => {
    setTags(prev => {
      return prev?.filter((_, key) => index != key);
    });
  };

  const handleUploadVideo = async (pay_load: any) => {
    if (isLargeVideo) {
      await uploadStream(pay_load);
    } else {
      await uplpodShortStream(pay_load);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A0A47', '#100E12']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientBorder}>
        <StackHeader
          title="Add Detail"
          onBackPress={() => navigation.goBack()}
        />

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}>
          <View style={{padding: 12}}>
            {!isEmpty(imageData) ? (
              <View style={styles.imageWrapper}>
                <View style={styles.previewContainer}>
                  <ImageBackground
                    style={styles.imageBackgroundStyle}
                    imageStyle={{borderRadius: 10}}
                    source={{
                      uri: imageData?.path ? imageData?.path : imageData,
                    }}>
                    <View style={styles.rowViewStyle}>
                      <Pressable
                        style={styles.editButton}
                        onPress={() =>
                          navigation.navigate('EditCoverScreen', {
                            videoUrl: data?.path ? data?.path : data?.uri,
                            data: data,
                            currentCover: imageData?.path || imageData,
                            currentTimestamp: coverTimestamp,
                            screenType: 'video',
                            formData: {
                              title: watchedValues?.title,
                              description: watchedValues?.description,
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
                      <Pressable
                        style={styles.closeButton}
                        onPress={() => {
                          setImageData(null);
                          setCoverTimestamp(null);
                        }}>
                        <CrossIcon color={'#ffffff'} />
                      </Pressable>
                    </View>
                    {/* Overlay for mobile aspect ratio */}
                    <View style={styles.cropOverlay}></View>
                  </ImageBackground>
                </View>
              </View>
            ) : (
              <Controller
                control={control}
                rules={{required: 'Image is required'}}
                name={'image'}
                render={({field: {onChange, value}, fieldState: {error}}) => (
                  <View style={styles.imagePressStyle2}>
                    <Pressable
                      onPress={() =>
                        navigation.navigate('EditCoverScreen', {
                          videoUrl: data?.uri,
                          data: data,
                          screenType: 'video',
                          formData: {
                            title: watchedValues?.title,
                            description: watchedValues?.description,
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
                      />
                      <Text style={[styles.buttonText, {marginLeft: 10}]}>
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

            {/* Description Input */}
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
                  maxLength={200}
                  maxLengthTitle={200}
                  numberOfLines={5}
                  mainContainerProps={styles.inputContainer}
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
              All content must be categorized for better search experience.
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
                      onPress={() => removoeTag(index)}
                      hitSlop={20}>
                      <CrossIcon color="white" width={16} height={16} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.commonTitle}>
              Tags are visible to others and will help in better search
              experience on SBO.
            </Text>
          </View>
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
        </KeyboardAwareScrollView>
        <View style={{padding: 12}}>
          {loading && isChunkedUpload && (
            <View style={styles.progressContainer}>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressText}>
                  Uploading... {uploadProgress}%
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {width: `${uploadProgress}%`},
                    ]}
                  />
                </View>
              </View>
            </View>
          )}
          <CustomButton
            text="Upload Video"
            onPress={handleSubmit(handleUploadVideo)}
            textStyle={[
              styles.buttonText,
              isFormValid && styles.activeButtonText,
            ]}
            btnStyle={[isFormValid && styles.activeButtonStyle]}
            isLoading={loading}
            disabled={loading || !isFormValid}
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBorder: {
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
    color: '#ffffff',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
    textTransform: 'capitalize',
  },
  imagePressStyle: {
    minHeight: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderStyle: 'dashed',
    paddingHorizontal: 10,
  },
  imagePressStyle2: {
    minHeight: 200,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    height: 20,
    width: 20,
  },
  commonTitle: {
    fontSize: fontSize.f12,
    color: Colors.grey,
    fontFamily: fonts['Poppins-Regular'],
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
    columnGap: 8,
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
    marginTop: 5,
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageBackgroundStyle: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  cropOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '30%',
    width: '40%',
    borderColor: Colors.grey,
    borderWidth: 0,
    borderStyle: 'dashed',
    borderRadius: 10,
    zIndex: 99,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  rowViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    padding: 10,
    zIndex: 1,
  },
  editPressPressStyle: {
    height: 30,
    width: 100,
    borderRadius: 20,
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
    alignSelf: 'flex-end',
  },
  activeButtonStyle: {
    backgroundColor: Colors.white,
  },
  activeButtonText: {
    color: Colors.black,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressTextContainer: {
    marginBottom: 8,
  },
  progressText: {
    color: '#ffffff',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: fontSize.f16,
    color: '#ffffff',
    fontFamily: fonts['Poppins-SemiBold'],
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  radioTitle: {
    fontSize: fontSize.f14,
    color: '#ffffff',
    fontFamily: fonts['Poppins-Medium'],
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
  editButtonText: {
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
