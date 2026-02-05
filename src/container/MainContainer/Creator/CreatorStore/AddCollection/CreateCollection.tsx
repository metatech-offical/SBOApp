import {CreateCollectionProps} from '@navigation/screens';
import FastImage from 'react-native-fast-image';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {Controller, useForm} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {fontSize, height, width} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import CustomImagePicker from '@components/CustomImagePicker/ImagePicker';
import {useState, useEffect} from 'react';
import CustomButton from '@components/CustomButtons/CustomButton';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import {useUploadCoverImageMutation} from '@rtkServices/ShortsService';
import {
  useCreateCollectionMutation,
  useGetCollectionDetailQuery,
  useUpdateCollectionMutation,
} from '@rtkServices/CreatorStoreService';
import {CrossIcon} from '@assets/svg/AuthFlowIcons';
import {Colors} from '@constant/colors';
import Loader from '@components/CustomLoader/Loader';
import {useToastMessage} from '@hooks/useToastMessage';
import {CommonActions} from '@react-navigation/native';

const CreateCollection = ({navigation, route}: CreateCollectionProps) => {
  const {showError, showSuccess} = useToastMessage();
  const {collectionId, fromProduct} = route?.params || {};

  const {data: collectionDetail, isLoading: isCollectionDetailLoading} =
    useGetCollectionDetailQuery(collectionId || '');

  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [imageData, setImageData] = useState<any>(
    collectionDetail?.data?.coverImage,
  );
  const [uploadImage] = useUploadCoverImageMutation();
  const [createCollection] = useCreateCollectionMutation();
  const [updateCollection] = useUpdateCollectionMutation();
  const [tag, setTag] = useState<string[]>(collectionDetail?.data?.tags || []);
  const [currentTagInput, setCurrentTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {control, handleSubmit, setValue} = useForm({
    defaultValues: {
      name: collectionDetail?.data?.name || '',
      description: collectionDetail?.data?.description || '',
      image: collectionDetail?.data?.coverImage || '',
      tag: collectionDetail?.data?.tags || [],
    },
  });

  // Sync form values when collection detail loads
  useEffect(() => {
    if (collectionDetail?.data) {
      setValue('name', collectionDetail.data.name || '');
      setValue('description', collectionDetail.data.description || '');
      setValue('tag', collectionDetail.data.tags || []);
      setTag(collectionDetail.data.tags || []);
      setImageData(collectionDetail.data.coverImage);
    }
  }, [collectionDetail?.data, setValue]);

  const handleUpload = async (imageData: any) => {
    // Check if imageData is already an AWS S3 URL, if so, return as is
    if (typeof imageData === 'string' && imageData.startsWith('https://')) {
      return imageData;
    }
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

  const createCollectionHandler = async ({
    data,
    imageUrl,
  }: {
    data: any;
    imageUrl: string;
  }) => {
    try {
      const body = {
        name: data.name,
        description: data.description,
        tags: tag,
        coverImage: imageUrl,
      };
      const res = await createCollection(body);
      setIsLoading(false);
      if (res?.data) {
        showSuccess(res?.data?.message || '');
        // If navigated from CreateProduct, go back and pass the new collection ID
        // Using dispatch with setParams to preserve the existing state
        if (fromProduct) {
          // This approach preserves the screen state and only updates the params
          navigation.dispatch({
            ...CommonActions.setParams({newCollectionId: res?.data?.data?._id}),
            source: navigation.getState().routes[navigation.getState().index - 1]?.key,
          });
          navigation.goBack();
        } else {
          navigation.goBack();
        }
      }
      if (res?.error) {
        showError(res?.error?.data?.message || '');
      }
    } catch (error) {
      setIsLoading(false);
      showError('Error creating collection');
    }
  };

  const updateCollectionHandler = async ({
    data,
    imageUrl,
  }: {
    data: any;
    imageUrl: string;
  }) => {
    try {
      const body: any = {
        tags: tag,
      };
      if (data.name && data.name !== collectionDetail?.data?.name) {
        body.name = data.name;
      }
      if (
        data.description &&
        data.description !== collectionDetail?.data?.description
      ) {
        body.description = data.description;
      }
      // Check if data.tag and collectionDetail?.data?.tags are arrays and if they are different

      if (imageUrl && imageUrl !== collectionDetail?.data?.coverImage) {
        body.coverImage = imageUrl;
      }

      const res = await updateCollection({
        collectionId: collectionId || '',
        data: body,
      });
      setIsLoading(false);
      if (res.data) {
        showSuccess(res?.data?.message || '');
        navigation.goBack();
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Error updating collection');
      }
    } catch (error) {
      setIsLoading(false);
      showError('Error updating collection');
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const imageUrl = await handleUpload(imageData);
      if (collectionId) {
        await updateCollectionHandler({data, imageUrl});
      } else {
        await createCollectionHandler({data, imageUrl});
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const removeTag = (index: number) => {
    const updatedTags = tag.filter((_, key) => index !== key);
    setTag(updatedTags);
    // Also update the form field value to keep them in sync
    setValue('tag', updatedTags);
  };

  const removeImage = () => {
    setImageData(null);
    setValue('image', '');
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
      />

      <View style={styles.contentOverlay}>
        <StackHeader
          title={collectionId ? 'Edit Collection' : 'Add Collection'}
          onBackPress={() => navigation.goBack()}
        />
        <Loader
          visible={!!(isCollectionDetailLoading && collectionId)}
          message={'Loading collection details...'}
          color={Colors.white}
        />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.formContainer}>
            {imageData ? (
              <View style={styles.imageWrapper}>
                <FastImage
                  source={{
                    uri:
                      imageData?.path ||
                      imageData.sourceURL ||
                      imageData?.uri ||
                      imageData ||
                      '',
                  }}
                  style={styles.uploadContainer}
                />
                <Pressable
                  style={styles.removeImageButton}
                  onPress={removeImage}>
                  <CrossIcon color={Colors.black} width={20} height={20} />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  setPickerOpen(true);
                }}
                style={styles.uploadContainer}>
                <FastImage
                  source={require('@assets/images/gallaryImage.png')}
                  style={styles.uploadIcon}
                />
                <Text style={styles.uploadText}>
                  Please ensure your upload is no larger than 25MB
                </Text>
              </Pressable>
            )}
            <Controller
              control={control}
              rules={{
                required: 'Name field is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              }}
              name="name"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  value={value}
                  label="Name"
                  placeholder="Name"
                  onChangeText={onChange}
                  error={error?.message}
                  autoCapitalize="words"
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
                  maxLength={300}
                  numberOfLines={5}
                  mainContainerProps={[styles.inputContainer]}
                  maxLengthTitle={300}
                />
              )}
            />
            <Controller
              control={control}
              name="tag"
              rules={{
                validate: value =>
                  (value && value.length >= 1) ||
                  'You must add at least 1 tags.',
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  value={currentTagInput}
                  label="Tags"
                  placeholder="Enter product tags"
                  onChangeText={text => {
                    const sanitizedText = text.replace(/\s/g, '');
                    setCurrentTagInput(sanitizedText);
                  }}
                  error={error?.message ?? ''}
                  maxLengthTitle={6}
                  minLengthTitle={tag?.length}
                  showAddButton={true}
                  onAddPress={() => {
                    const trimmedValue = currentTagInput?.trim();
                    if (
                      trimmedValue &&
                      (!tag || tag?.length < 6)
                    ) {
                      // Check if tag already exists (case-insensitive)
                      const isDuplicate = tag?.some(
                        existingTag => existingTag.toLowerCase() === trimmedValue.toLowerCase()
                      );
                      
                      if (isDuplicate) {
                        showError('This tag already exists!');
                        return;
                      }
                      
                      const newTags = tag
                        ? [...tag, trimmedValue]
                        : [trimmedValue];
                      onChange(newTags);
                      setTag(newTags);
                      setCurrentTagInput('');
                    }
                  }}
                />
              )}
            />
            {tag?.length > 0 && (
              <View style={styles.tagsContainer}>
                {tag?.map((tag, index) => (
                  <View key={index} style={styles.tagItem}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <Pressable onPress={() => removeTag(index)}>
                      <CrossIcon color={Colors.white} width={16} height={16} />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.buttonContainer}>
              <CustomButton
                text="Cancel"
                onPress={() => {
                  navigation.goBack();
                }}
                btnStyle={styles.btnStyl}
              />
              <CustomButton
                text={collectionId ? 'Update' : 'Submit'}
                onPress={handleSubmit(onSubmit)}
                btnStyle={{width: '68%', backgroundColor: Colors.white}}
                textStyle={{color: Colors.black}}
                isLoading={isLoading}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        {pickerOpen && (
          <CustomImagePicker
            selectedCancel={() => setPickerOpen(false)}
            selectedValue={(item: any) => {
              setPickerOpen(false);
              setImageData(item);
            }}
          />
        )}
      </View>
    </View>
  );
};

export default CreateCollection;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 150,
  },
  formContainer: {
    paddingHorizontal: 15,
  },
  uploadContainer: {
    height: height * 0.3,
    borderWidth: 1.5,
    borderColor: '#8C8A94',
    borderRadius: 10,
    padding: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    borderStyle: 'dashed',
    width: '100%',
    alignSelf: 'center',
  },
  uploadIcon: {
    width: 30,
    height: 30,
    marginBottom: 8,
  },
  uploadText: {
    color: '#8C8A94',
    fontSize: fontSize.f12,
    textAlign: 'center',
    width: '90%',
    fontFamily: fonts['Poppins-Medium'],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
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
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
  },
  bioButton: {
    height: 100,
  },
  inputContainer: {
    width: width - 25,
    alignSelf: 'center',
  },
  btnStyl: {
    width: '28%',
    backgroundColor: 'transparent',
    borderWidth: 0.8,
    borderColor: Colors.grey,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    alignSelf: 'center',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
