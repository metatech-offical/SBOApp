import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {PostUploadScreenProps} from '@navigation/screens';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import {fonts} from '@constant/fontfamily';
import {Controller, useForm} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import CustomImagePicker from '@components/CustomImagePicker/ImagePicker';
import CustomButton from '@components/CustomButtons/CustomButton';
import {CrossIcon} from '@assets/svg/AuthFlowIcons';
import {useAppSelector} from '@store/index';
import {RootState} from '@store/index';
import {
  useCreatePostMutation,
  useUploadCroppCoverImageMutation,
} from '@rtkServices/ShortsService';
import {navigationRef} from '@navigation/utils';
import {Colors} from '@constant/colors';
import {fontSize, height} from '@constant/fontSize';
import {useToastMessage} from '@hooks/useToastMessage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const PostUploadScreen = ({navigation}: PostUploadScreenProps) => {
  const {showError, showSuccess} = useToastMessage();
  const insets = useSafeAreaInsets();
  const {control, handleSubmit, watch, setValue} = useForm();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [imageData, setImageData] = useState<any>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useAppSelector((state: RootState) => state.user);
  const [uploadImage] = useUploadCroppCoverImageMutation();
  const [createPost] = useCreatePostMutation();
  const captionValue = watch('caption', '');

  const handleUpload = async (imageData: any) => {
    const result = await uploadImage({
      path: imageData.path,
      mime: imageData.mime || 'image/jpeg',
      filename: imageData.filename,
    }).unwrap();
    const imageUrl = result?.data;
    if (!imageUrl) {
      throw new Error(result?.message || 'Image upload returned no URL');
    }
    return imageUrl;
  };

  const uploadPost = async (data: any) => {
    setIsLoading(true);
    try {
      const uploadedImageUrls = [];
      for (const image of imageData) {
        try {
          const imageUrl = await handleUpload(image);
          uploadedImageUrls.push(imageUrl);
        } catch (error: any) {
          console.error('Error uploading image:', error);
          showError(
            error?.data?.message ||
              error?.message ||
              'Error uploading one or more images',
          );
          setIsLoading(false);
          return;
        }
      }

      if (uploadedImageUrls.length === 0) {
        showError('Please add at least one image to your post');
        setIsLoading(false);
        return;
      }

      const payload = {
        caption: data.caption || '',
        tags: tags,
        photoUrls: uploadedImageUrls,
      };
      const response = await createPost(payload).unwrap();
      if (response?.success) {
        showSuccess(response?.message || 'Post uploaded successfully');
        navigationRef.current?.reset({
          index: 0,
          routes: [{name: 'HomeScreen'}],
        });
      } else {
        showError(response?.message || 'Failed to upload post');
      }
    } catch (error: any) {
      console.error('Upload post error:', error);
      showError(
        error?.data?.message ||
          error?.message ||
          'Failed to upload post. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeTag = (index: number) => {
    setTags(prev => prev?.filter((_, key) => index !== key));
  };
  const removeImage = (index: number) => {
    const newImageData = imageData?.filter((_: any, key: any) => index !== key);
    setImageData(newImageData);
    setValue('image', newImageData?.length > 0 ? newImageData : null);

    if (newImageData?.length === 0) {
      setActiveImageIndex(0);
    } else if (index <= activeImageIndex && activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    } else if (index < activeImageIndex) {
      // Keep the same index if removing an image before the active one
    } else {
      // If removing the active image, set to first image
      setActiveImageIndex(0);
    }
  };

  const setActiveImage = (index: number) => {
    setActiveImageIndex(index);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A0A47', '#100E12']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFillObject}
      />
      <StackHeader title="New post" onBackPress={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.userDetailContainer}>
            <View style={styles.userRow}>
              <FastImage
                source={
                  user?.profilePicture
                    ? {uri: user?.profilePicture}
                    : require('@assets/images/DummyUserImage.png')
                }
                style={styles.userImage}
              />
              <Text style={styles.userName}>{user?.username || ''}</Text>
              <Text style={styles.userHandle}>@{user?.username || ''}</Text>
            </View>
          </View>

          {/* Caption Input */}
          <Controller
            control={control}
            name="caption"
            render={({field: {onChange, onBlur, value}}) => (
              <View style={styles.captionWrapper}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Caption goes here"
                  placeholderTextColor="#888"
                  style={styles.captionInput}
                  maxLength={200}
                  textAlignVertical="top"
                  multiline={true}
                />
              </View>
            )}
          />

          {/* Image Upload Section */}
          <Controller
            control={control}
            name="image"
            rules={{required: 'Please add at least one image to your post'}}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <View style={styles.imageUploadContainer}>
                {imageData?.length > 0 ? (
                  <View>
                    {/* Main selected image */}
                    <View style={styles.uploadedImageContainer}>
                      <FastImage
                        source={{
                          uri:
                            imageData[activeImageIndex]?.path ||
                            imageData[activeImageIndex],
                        }}
                        style={styles.uploadedImage}
                        resizeMode="cover"
                      />
                      <Pressable
                        style={styles.removeImageButton}
                        onPress={() => {
                          removeImage(activeImageIndex);
                        }}>
                        <CrossIcon color="#fff" width={20} height={20} />
                      </Pressable>
                    </View>

                    {/* Horizontal scrollable thumbnails */}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.thumbnailScrollView}
                      contentContainerStyle={styles.thumbnailContainer}>
                      {imageData?.map((image: any, index: number) => (
                        <Pressable
                          key={index}
                          style={styles.thumbnailWrapper}
                          onPress={() => setActiveImage(index)}>
                          <FastImage
                            source={{uri: image?.path || image}}
                            style={[
                              styles.thumbnail,
                              index === activeImageIndex &&
                                styles.activeThumbnail,
                            ]}
                            resizeMode="cover"
                          />
                          {index > 0 && (
                            <Pressable
                              style={styles.removeThumbnailButton}
                              onPress={e => {
                                e.stopPropagation();
                                removeImage(index);
                              }}>
                              <CrossIcon color="#fff" width={12} height={12} />
                            </Pressable>
                          )}
                        </Pressable>
                      ))}

                      {/* Add more images button */}
                      {imageData.length < 10 && (
                        <Pressable
                          style={styles.addMoreImageButton}
                          onPress={() => setPickerOpen(true)}>
                          <Text style={styles.addMoreImageText}>+</Text>
                        </Pressable>
                      )}
                    </ScrollView>
                  </View>
                ) : (
                  <Pressable
                    style={styles.imageUploadButton}
                    onPress={() => setPickerOpen(true)}>
                    <View style={styles.uploadPlaceholder}>
                      <View style={styles.uploadIcon}>
                        <FastImage
                          source={require('@assets/images/gallaryImage.png')}
                          style={styles.uploadIconImage}
                        />
                      </View>
                      <Text style={styles.uploadText}>
                        Please ensure your upload is{'\n'}no larger than 25MB
                      </Text>
                    </View>
                  </Pressable>
                )}
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </View>
            )}
          />

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
                label="Tags"
                placeholder="Enter your own tags"
                onChangeText={text => onChange(text.replace(/\s/g, ''))}
                error={error?.message ?? ''}
                mainContainerProps={{marginTop: 20}}
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

          <Text style={styles.tagHelpText}>
            These tags should be separated with comma are for better search
            {'\n'}
            experience on Smart App.
          </Text>

          {/* Display Tags */}
          {tags?.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags?.map((tag, index) => (
                <View key={index} style={styles.tagItem}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity
                    onPress={() => removeTag(index)}
                    hitSlop={20}>
                    <CrossIcon color="#fff" width={16} height={16} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>

      {/* Bottom Action Bar — sit above Android system back / gesture nav */}
      <View
        style={[
          styles.bottomBar,
          {paddingBottom: Math.max(insets.bottom, 8)},
        ]}>
        <View style={styles.actionButtons}>
          {/* <Pressable
            style={styles.actionButton}
            onPress={() => setPickerOpen(true)}>
            <FastImage
              source={require('@assets/images/gallaryImage.png')}
              style={{width: 24, height: 24}}
            />
          </Pressable>
          <Pressable style={styles.actionButton}>
            <FastImage
              source={require('@assets/images/CemeraIcon.png')}
              style={{width: 24, height: 24}}
            />
          </Pressable> */}
        </View>

        <CustomButton
          text="Post"
          onPress={handleSubmit(uploadPost)}
          textStyle={styles.postButtonText}
          isLoading={isLoading}
          disabled={isLoading || (!captionValue && imageData.length === 0)}
          btnStyle={[
            styles.postButton,
            !captionValue &&
              imageData.length === 0 &&
              styles.postButtonDisabled,
          ]}
        />
      </View>

      {/* Image Picker Modal */}
      {pickerOpen && (
        <CustomImagePicker
          selectedCancel={() => setPickerOpen(false)}
          selectedValue={(item: any) => {
            setPickerOpen(false);
            const newImageData = [...imageData, item];
            setImageData(newImageData);
            setValue('image', newImageData);
            setActiveImageIndex(newImageData.length - 1);
          }}
          isCropping={false}
          mediaType="photo"
        />
      )}
    </View>
  );
};

export default PostUploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  userDetailContainer: {
    marginBottom: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  userHandle: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: '#888',
  },
  captionWrapper: {
    marginBottom: 20,
  },
  captionInput: {
    backgroundColor: 'transparent',
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    textAlignVertical: 'top',
  },
  imageUploadContainer: {
    marginBottom: 20,
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: '#444',
    borderStyle: 'dashed',
    borderRadius: 12,
    width: '100%',
    height: height / 2.3,
  },
  uploadPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  uploadIconImage: {
    width: 30,
    height: 30,
  },
  uploadIcon: {},
  uploadIconText: {
    fontSize: fontSize.f22,
  },
  uploadText: {
    color: '#888',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    textAlign: 'center',
    lineHeight: 20,
  },
  uploadedImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: height / 2.3,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagHelpText: {
    color: '#888',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    marginBottom: 16,
    lineHeight: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tagItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagText: {
    color: Colors.white,
    fontSize: fontSize.f13,
    fontFamily: fonts['Poppins-Medium'],
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButton: {
    backgroundColor: Colors.white,
    width: '25%',
    marginBottom: 5,
    marginTop: 5,
  },
  postButtonDisabled: {
    backgroundColor: '#444',
    opacity: 0.5,
  },
  postButtonText: {
    color: Colors.black,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },
  errorText: {
    color: '#FF4444',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    marginTop: 8,
  },
  thumbnailScrollView: {
    marginTop: 12,
  },
  thumbnailContainer: {
    paddingHorizontal: 4,
    gap: 8,
  },
  thumbnailWrapper: {
    position: 'relative',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: '#8800FF',
  },
  removeThumbnailButton: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 68, 68, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreImageButton: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#444',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreImageText: {
    color: '#888',
    fontSize: fontSize.f22,
    fontFamily: fonts['Poppins-Regular'],
  },
});
