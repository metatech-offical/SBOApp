import {CrossIcon} from '@assets/svg/AuthFlowIcons';
import {PlusIcon} from '@assets/svg/CommonIcons';
import CustomButton from '@components/CustomButtons/CustomButton';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import CustomDropDown from '@components/DropDown/CustomDropDown';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {navigate} from '@navigation/utils';
import {
  useGetCollectionsQuery,
  useGetGlobalReturnPolicyQuery,
} from '@rtkServices/CreatorStoreService';
import {ProductCategoryData} from '@utils/data';
import {useState} from 'react';
import {useEffect} from 'react';
import {Controller} from 'react-hook-form';
import {useToastMessage} from '@hooks/useToastMessage';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ProductInfo = ({
  onNextStep,
  onSaveDraft,
  control,
  handleSubmit,
  watch,
  setValue,
  isEdit,
  newCollectionId,
}: ProductInfoProps) => {
  const {showError} = useToastMessage();
  const {data: collections, refetch: refetchCollections} =
    useGetCollectionsQuery();
  const {data: globalReturnPolicy} = useGetGlobalReturnPolicyQuery();
  const [collectionsData, setCollectionsData] = useState<any[]>([]);
  const [currentTagInput, setCurrentTagInput] = useState('');
  const [tag, setTag] = useState<string[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [variantErrors, setVariantErrors] = useState<{
    [key: number]: {[field: string]: string};
  }>({});

  useEffect(() => {
    const subscription = watch((value: any, {name}: any) => {
      if (
        name === 'variants' &&
        value?.variants &&
        value?.variants?.length > 0
      ) {
        setVariants(value.variants);
      } else if (
        name === 'variants' &&
        (!value?.variants || value?.variants?.length === 0)
      ) {
        setVariants([]);
      }
      if (name === 'tag' && value?.tag && value?.tag?.length > 0) {
        setTag(value?.tag);
      }
    });

    const currentValues = watch();
    if (currentValues?.variants && currentValues?.variants?.length > 0) {
      setVariants(currentValues?.variants);
    } else {
      setVariants([]);
    }
    if (currentValues?.tag && currentValues?.tag?.length > 0) {
      setTag(currentValues?.tag);
    }

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (collections?.success) {
      setCollectionsData(collections?.data);
    }
  }, [collections]);

  // Handle newly created collection auto-selection
  useEffect(() => {
    if (newCollectionId) {
      refetchCollections().then((result: any) => {
        if (result?.data?.success) {
          const newCollection = result.data.data.find(
            (col: any) => col._id === newCollectionId,
          );
          if (newCollection) {
            setValue('collection', newCollection);
          }
        }
      });
    }
  }, [newCollectionId, refetchCollections, setValue]);

  useEffect(() => {
    // Only set global return policy when creating a new product, not when editing
    if (globalReturnPolicy?.success && !isEdit) {
      const returnPolicyValue = globalReturnPolicy?.data?.returnPolicy || '';
      setValue('return_policy', returnPolicyValue);
    }
  }, [globalReturnPolicy, setValue, isEdit]);

  const removeTag = (index: number) => {
    const newTags = tag.filter((_, i) => index !== i);
    setTag(newTags);
    control._fields.tag?.ref?.onChange(newTags);
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const updatedVariants = variants.map((variant, i) =>
      i === index ? {...variant, [field]: value} : variant,
    );

    setVariants(updatedVariants);

    // Update the form field as well
    control._formValues.variants = updatedVariants;

    // Clear error for this field when user starts typing
    if (variantErrors[index]?.[field]) {
      setVariantErrors(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          [field]: '',
        },
      }));
    }
  };

  const addVariant = () => {
    const newVariant = {
      size: '',
      color: '',
      stock: '',
      price: '',
      sku: '',
    };
    const updatedVariants = [...variants, newVariant];
    setVariants(updatedVariants);

    // Update the form field as well
    control._formValues.variants = updatedVariants;
  };

  const removeVariant = (index: number) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);

    // Update the form field as well
    control._formValues.variants = updatedVariants;
  };

  const validateVariants = (): boolean => {
    if (variants.length === 0) return true;

    const errors: {[key: number]: {[field: string]: string}} = {};
    let isValid = true;

    variants.forEach((variant, index) => {
      const variantErrors: {[field: string]: string} = {};

      if (!variant.size || variant.size.trim() === '') {
        variantErrors.size = 'Size is required';
        isValid = false;
      }

      if (!variant.color || variant.color.trim() === '') {
        variantErrors.color = 'Color is required';
        isValid = false;
      }

      if (!variant.stock || variant.stock.toString().trim() === '') {
        variantErrors.stock = 'Quantity is required';
        isValid = false;
      }

      if (!variant.price || variant.price.toString().trim() === '') {
        variantErrors.price = 'Price is required';
        isValid = false;
      }

      if (!variant.sku || variant.sku.trim() === '') {
        variantErrors.sku = 'SKU is required';
        isValid = false;
      }

      if (Object.keys(variantErrors).length > 0) {
        errors[index] = variantErrors;
      }
    });

    setVariantErrors(errors);
    return isValid;
  };

  const handleNextStep = (data: any) => {
    // Validate variants before proceeding
    if (!validateVariants()) {
      return;
    }

    if (onNextStep) {
      // Include variants in the data
      const dataWithVariants = {
        ...data,
        variants: variants,
      };
      onNextStep(dataWithVariants);
    }
  };

  const handleSaveDraft = (data: any) => {
    if (!validateVariants()) {
      return;
    }

    if (onSaveDraft) {
      const dataWithVariants = {
        ...data,
        variants: variants,
      };
      onSaveDraft(dataWithVariants);
    }
  };

  const addCollection = () => {
    navigate('CreateCollection', {
      collectionId: '',
      fromProduct: true,
    });
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.formContainer}>
        <Controller
          control={control}
          rules={{
            required: 'Product name field is required',
            minLength: {
              value: 2,
              message: 'Product name must be at least 2 characters',
            },
          }}
          name="product_name"
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <TextInputWithLabels
              label="Product Name"
              value={value}
              placeholder="Enter your product's name"
              onChangeText={onChange}
              error={error?.message}
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          rules={{
            required: 'Description field is required',
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters',
            },
          }}
          name="description"
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <TextInputWithLabels
              label="Description"
              value={value}
              placeholder="Enter product description"
              onChangeText={onChange}
              error={error?.message}
              multiline
              maxLength={300}
              btnStyle={styles.bioButton}
              numberOfLines={5}
              height={90}
            />
          )}
        />

        <Controller
          control={control}
          rules={{
            required: 'Category field is required',
          }}
          name="category"
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <CustomDropDown
              defaultValue={value}
              label="Category"
              data={ProductCategoryData}
              placeHolder="Select category"
              onSelect={onChange}
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="tag"
          rules={{
            validate: value =>
              (value && value.length >= 1) || 'You must add at least 1 tag.',
          }}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <TextInputWithLabels
              value={currentTagInput}
              label="Tags"
              placeholder="Enter product tags"
              onChangeText={text => setCurrentTagInput(text.replace(/\s/g, ''))}
              error={error?.message ?? ''}
              mainContainerProps={{marginTop: 20}}
              maxLengthTitle={6}
              minLengthTitle={tag?.length}
              showAddButton={true}
              onAddPress={() => {
                const trimmedValue = currentTagInput?.trim();
                if (trimmedValue && (!tag || tag?.length < 6)) {
                  // Check if tag already exists (case-insensitive)
                  const isDuplicate = tag?.some(
                    existingTag =>
                      existingTag.toLowerCase() === trimmedValue.toLowerCase(),
                  );

                  if (isDuplicate) {
                    showError('This tag already exists!');
                    return;
                  }

                  const newTags = tag ? [...tag, trimmedValue] : [trimmedValue];
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
            {tag.map((tag, index) => (
              <View key={index} style={styles.tagItem}>
                <Text style={styles.tagText}>{tag}</Text>
                <Pressable onPress={() => removeTag(index)}>
                  <CrossIcon color="#fff" width={16} height={16} />
                </Pressable>
              </View>
            ))}
          </View>
        )}
        <View style={styles.plusIconWrapper}>
          <View style={{width: '85%'}}>
            <Controller
              control={control}
              rules={{
                required: 'Collection field is required',
              }}
              name="collection"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <CustomDropDown
                  defaultValue={value}
                  label="Collection"
                  data={collectionsData}
                  placeHolder="Select collection"
                  onSelect={onChange}
                  error={error?.message}
                />
              )}
            />
          </View>
          <Pressable onPress={addCollection} style={styles.plusIconContainer}>
            <PlusIcon color="#fff" width={16} height={16} />
          </Pressable>
        </View>

        <Controller
          control={control}
          name="sku"
          rules={{
            required: 'SKU field is required',
          }}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <TextInputWithLabels
              value={value}
              label="SKU"
              placeholder="Enter SKU (e.g., PROD-001)"
              onChangeText={onChange}
              error={error?.message}
              mainContainerProps={{marginTop: 20}}
            />
          )}
        />

        <Text style={styles.sectionTitle}>Variants</Text>

        {/* Display existing variants */}
        {variants?.map((variant, index) => (
          <View key={index} style={styles.variantContainer}>
            <View style={styles.variantHeader}>
              <Text style={styles.variantTitle}>Variant {index + 1}</Text>
              <Pressable
                onPress={() => removeVariant(index)}
                style={styles.removeVariantButton}>
                <CrossIcon color="#fff" width={16} height={16} />
              </Pressable>
            </View>

            <View style={styles.variantInputs}>
              <TextInputWithLabels
                value={variant.size}
                placeholder="Enter size"
                onChangeText={text => updateVariant(index, 'size', text)}
                mainContainerProps={{width: '48%'}}
                error={variantErrors[index]?.size}
              />
              <TextInputWithLabels
                value={variant.color}
                placeholder="Enter color"
                onChangeText={text => updateVariant(index, 'color', text)}
                mainContainerProps={{width: '48%'}}
                error={variantErrors[index]?.color}
              />
            </View>

            <View style={styles.variantInputs}>
              <TextInputWithLabels
                value={variant.stock?.toString() || ''}
                placeholder="Enter quantity"
                onChangeText={text => {
                  // Only allow non-negative integers
                  let sanitized = text.replace(/[^0-9]/g, '');
                  // Remove leading zeros
                  sanitized = sanitized.replace(/^0+(\d)/, '$1');
                  updateVariant(index, 'stock', sanitized);
                }}
                keyboardType="numeric"
                mainContainerProps={{width: '48%'}}
                error={variantErrors[index]?.stock}
              />
              <TextInputWithLabels
                value={variant.price?.toString() || ''}
                placeholder="Enter price"
                onChangeText={text => {
                  let sanitized = text.replace(/[^0-9.]/g, '');
                  const parts = sanitized.split('.');
                  let newValue = parts[0];
                  if (parts.length > 1) {
                    newValue += '.' + parts.slice(1).join('');
                  }
                  newValue = newValue.replace(/^0+(\d)/, '$1');
                  updateVariant(index, 'price', newValue);
                }}
                keyboardType="numeric"
                mainContainerProps={{width: '48%'}}
                error={variantErrors[index]?.price}
              />
            </View>
            <View style={styles.variantInputs}>
              <TextInputWithLabels
                value={variant.sku}
                placeholder="Enter SKU"
                onChangeText={text => updateVariant(index, 'sku', text)}
                mainContainerProps={{width: '48%'}}
                error={variantErrors[index]?.sku}
              />
            </View>
          </View>
        ))}

        {/* Add Variant Button */}
        <CustomButton
          text="Add Variant"
          onPress={addVariant}
          btnStyle={{
            backgroundColor: Colors.white,
            marginTop: 16,
            marginBottom: 10,
            minHeight: 55,
          }}
          textStyle={{color: Colors.black}}
        />
        <Text style={styles.infoText}>
          If your product has different options such as colors, sizes, prices,
          or quantities, please add them as variants here.
        </Text>

        {variants?.length > 0 ? null : (
          <View style={{marginTop: 20}}>
            <Controller
              control={control}
              name="price"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  value={value}
                  label="Price"
                  placeholder="Enter price"
                  onChangeText={text => {
                    const sanitized = text.replace(/[^0-9.]/g, '');
                    const parts = sanitized.split('.');
                    let newValue = parts[0];
                    if (parts.length > 1) {
                      newValue += '.' + parts.slice(1).join('');
                    }
                    if (newValue.startsWith('-')) {
                      newValue = newValue.replace('-', '');
                    }
                    onChange(newValue);
                  }}
                  error={error?.message}
                  keyboardType="numeric"
                />
              )}
            />

            <Controller
              control={control}
              name="stock"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  value={value}
                  label="Enter Quantity"
                  placeholder="Enter Quantity"
                  onChangeText={onChange}
                  error={error?.message}
                  keyboardType="numeric"
                />
              )}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>Return Policy</Text>

        <Controller
          control={control}
          name="return_policy"
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <TextInputWithLabels
              value={value}
              placeholder="Add your return policy here (optional)"
              onChangeText={onChange}
              error={error?.message}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          )}
        />

        <View style={styles.buttonContainer}>
          <CustomButton
            text="Save Draft"
            onPress={handleSubmit(handleSaveDraft)}
            btnStyle={{width: '48%'}}
          />
          <CustomButton
            text="Next"
            onPress={handleSubmit(handleNextStep)}
            btnStyle={{width: '48%', backgroundColor: Colors.white}}
            textStyle={{color: Colors.black}}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ProductInfo;

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 250,
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    marginTop: 24,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tagText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
  },
  variantContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  variantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  variantTitle: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  removeVariantButton: {
    padding: 4,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: 8,
  },
  variantInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.grey,
    marginBottom: 10,
  },
  bioButton: {
    height: 100,
  },
  plusIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  plusIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: 52,
    marginTop: 35,
  },
});
