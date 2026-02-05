import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import StackHeader from '@components/CustomHeaders/StackHeader';
import ProductInfo from '@components/ScreenLayouts/CreatorAddProduct/ProductInfo';
import ProductMedia from '@components/ScreenLayouts/CreatorAddProduct/ProductMedia';
import {fonts} from '@constant/fontfamily';
import {CreateProductProps} from '@navigation/screens';
import {useUploadCoverImageMutation} from '@rtkServices/ShortsService';
import {ProductTabData} from '@utils/data';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {
  useCreateProductMutation,
  useGetProductDetailQuery,
  useUpdateProductMutation,
} from '@rtkServices/CreatorStoreService';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const CreateProduct = ({navigation, route}: CreateProductProps) => {
  const {showError, showSuccess} = useToastMessage();
  const {itemId, isEdit, newCollectionId} = route.params || {};
  const [activeStep, setActiveStep] = useState(1);
  const [images, setImages] = useState<any[]>([]);
  const [productData, setProductData] = useState<any>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [createProduct] = useCreateProductMutation();
  const [uploadImage] = useUploadCoverImageMutation();
  const {data: productDetail} = useGetProductDetailQuery(itemId ?? '', {
    skip: !itemId,
  });
  const [updateProduct] = useUpdateProductMutation();

  const {control, handleSubmit, reset, watch, setValue} = useForm({
    defaultValues: {
      product_name: productDetail?.data?.productName || '',
      description: productDetail?.data?.description || '',
      category: productDetail?.data?.category || '',
      tag: productDetail?.data?.tags || [],
      collection: productDetail?.data?.collectionId || '',
      price: productDetail?.data?.price?.toString() || '',
      quantity:
        productDetail?.data?.variants?.length > 0
          ? ''
          : productDetail?.data?.stock?.toString() || '',
      sku: productDetail?.data?.sku || '',
      return_policy: productDetail?.data?.returnPolicy || '',
      variants: productDetail?.data?.variants || [],
      stock:
        productDetail?.data?.variants?.length > 0
          ? ''
          : productDetail?.data?.stock?.toString() || '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (productDetail?.data && itemId) {
      const data = productDetail.data;

      reset({
        product_name: data.productName || '',
        description: data.description || '',
        category: data.category || '',
        tag: data.tags || [],
        collection: data.collectionId || '',
        price: data.price?.toString() || '',
        quantity: data.variants?.length > 0 ? '' : data.stock?.toString() || '',
        sku: data.sku || '',
        return_policy: data.returnPolicy || '',
        variants: data.variants || [],
        stock: data.variants?.length > 0 ? '' : data.stock?.toString() || '',
      });

      if (data.media && data.media.length > 0) {
        const formattedImages = data.media.map(
          (url: string, index: number) => ({
            sourceURL: url,
            path: url,
            id: index,
          }),
        );
        setImages(formattedImages);
      }
    }
  }, [productDetail, itemId, reset]);

  const UploadImages = async (images: any[]) => {
    const imageUrls = await Promise.all(
      images.map(async image => {
        const imageUrl = await handleUpload(image);
        return imageUrl;
      }),
    );
    return imageUrls.filter(url => url);
  };

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

  const handleNextStep = (data: any) => {
    setProductData(data);
    setActiveStep(2);
  };

  const handleSaveDraft = async (data: any) => {
    // Validation: Check if images are selected
    if (!images || images.length === 0) {
      showError('Please add product images to save draft');
      return;
    }

    setLoadingDraft(true);
    try {
      const formattedVariants =
        data?.variants?.map((variant: any) => ({
          ...variant,
          price: parseFloat(variant.price) || 0,
          stock: parseInt(variant.stock, 10) || 0,
        })) || [];

      const ImageUrls = await UploadImages(images);
      const payload = {
        productName: productData?.product_name.trim(),
        description: productData?.description,
        price: Number(productData?.price),
        stock: Number(productData?.stock),
        media: ImageUrls,
        sku: productData?.sku,
        category: productData?.category?.name,
        returnPolicy: productData?.return_policy,
        tags: productData?.tag,
        collectionId: productData?.collection?._id,
        variants: formattedVariants,
        hasVariants: formattedVariants?.length > 0 ? true : false,
        status: 'coming_soon',
      };
      const result = await createProduct(payload).unwrap();
      setLoadingDraft(false);
      if (result?.success) {
        showSuccess(result?.message || '');
        navigation.goBack();
      }
    } catch (error) {
      setLoadingDraft(false);
      showError('Something went wrong');
    }
  };

  const handleEdit = async (data: any) => {
    setLoadingPublish(true);
    try {
      const currentFormData = watch();
      const ImageUrls = await UploadImages(images);
      const formattedVariants =
        currentFormData?.variants?.map((variant: any) => ({
          ...variant,
          price: Number(variant.price),
          stock: Number(variant.stock),
        })) || [];

      const payload = {
        productName: currentFormData?.product_name.trim(),
        description: currentFormData?.description,
        price: Number(currentFormData?.price),
        stock: Number(currentFormData?.stock),
        media: ImageUrls,
        sku: currentFormData?.sku,
        category: currentFormData?.category?.name,
        returnPolicy: currentFormData?.return_policy,
        tags: currentFormData?.tag,
        collectionId: currentFormData?.collection?._id,
        variants: formattedVariants,
        status: productDetail?.data?.status,
        hasVariants: formattedVariants?.length > 0 ? true : false,
      };
      const result = await updateProduct({
        id: itemId || '',
        data: payload,
      });
      setLoadingPublish(false);
      if (result?.data?.success) {
        showSuccess(result?.data?.message || '');
        navigation.goBack();
      }
    } catch (error) {
      setLoadingPublish(false);
      showError('Something went wrong');
    }
  };

  const handlePublish = async (data: any) => {
    setLoadingPublish(true);
    try {
      const ImageUrls = await UploadImages(images);

      const formattedVariants =
        data?.variants?.map((variant: any) => ({
          ...variant,
          price: Number(variant.price),
          stock: Number(variant.stock),
        })) || [];

      const payload = {
        productName: productData?.product_name.trim(),
        description: productData?.description,
        price: Number(productData?.price),
        stock: Number(productData?.stock),
        media: ImageUrls,
        sku: productData?.sku,
        category: productData?.category?.name,
        returnPolicy: productData?.return_policy,
        tags: productData?.tag,
        collectionId: productData?.collection?._id,
        variants: formattedVariants,
        hasVariants: formattedVariants?.length > 0 ? true : false,
        status: 'live',
      };
      const result = await createProduct(payload).unwrap();
      setLoadingPublish(false);
      if (result?.success) {
        showSuccess(result?.message || '');
        navigation.goBack();
      }
    } catch (error: any) {
      setLoadingPublish(false);
      showError(error?.data?.message || 'Something went wrong');
    }
  };

  const handleImagesChange = (newImages: any[]) => {
    setImages(newImages);
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
      />
      <View style={styles.contentOverlay}>
        <StackHeader
          title={'Add Product'}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.stepContainerWrapper}>
          {ProductTabData?.map(item => (
            <Pressable
              key={item.id}
              style={[
                styles.stepContainer,
                {
                  borderBottomWidth: activeStep === item.id ? 2 : 0,
                  borderBottomColor:
                    activeStep === item.id ? '#1AD655' : 'transparent',
                },
              ]}
              onPress={() => setActiveStep(item.id)}>
              <Text style={styles.stepText}>{item.title}</Text>
            </Pressable>
          ))}
        </View>

        {activeStep === 1 ? (
          <ProductInfo
            control={control}
            handleSubmit={handleSubmit}
            onNextStep={handleNextStep}
            onSaveDraft={handleSaveDraft}
            watch={watch}
            setValue={setValue}
            isEdit={isEdit}
            newCollectionId={newCollectionId}
          />
        ) : (
          <ProductMedia
            isEdit={isEdit}
            loadingDraft={loadingDraft}
            loadingPublish={loadingPublish}
            images={images}
            onImagesChange={handleImagesChange}
            onSaveDraft={data => handleSaveDraft({...productData, ...data})}
            onPublish={data => {
              if (isEdit) {
                handleEdit({...productData, ...data});
              } else {
                handlePublish({...productData, ...data});
              }
            }}
          />
        )}
      </View>
    </View>
  );
};

export default CreateProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContainerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepContainer: {
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  stepText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
  },
});
