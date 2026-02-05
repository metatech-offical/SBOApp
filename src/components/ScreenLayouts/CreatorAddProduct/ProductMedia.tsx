import React, {useEffect, useState} from 'react';
import CustomButton from '@components/CustomButtons/CustomButton';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize, height} from '@constant/fontSize';
import {handleOpenGallery} from '@utils/general';
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {CrossIcon} from '@assets/svg/AuthFlowIcons';

const ProductMedia = ({
  loadingDraft,
  loadingPublish,
  images,
  onImagesChange,
  onSaveDraft,
  onPublish,
  isEdit,
}: ProductMediaProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (images?.length === 0) {
      setSelectedIndex(0);
    } else if (selectedIndex > images?.length - 1) {
      setSelectedIndex(images.length - 1);
    }
  }, [images?.length, selectedIndex]);

  const handleImages = async () => {
    const newImages = await handleOpenGallery();
    onImagesChange([...images, ...newImages]);
    if (images?.length === 0 && newImages.length > 0) setSelectedIndex(0);
  };

  const removeImage = (index: number) => {
    const updatedImages = images?.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
    if (updatedImages?.length === 0) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(prev => {
        if (index < prev) return prev - 1;
        if (index === prev) return Math.min(prev, updatedImages?.length - 1);
        return prev;
      });
    }
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft({images});
    }
  };

  const handlePublish = () => {
    if (onPublish) {
      onPublish({images});
    }
  };

  return (
    <View style={styles.container}>
      {images.length === 0 ? (
        <Pressable onPress={handleImages} style={styles.uploadContainer}>
          <FastImage
            source={require('@assets/images/gallaryImage.png')}
            style={styles.uploadIcon}
          />
          <Text style={styles.uploadText}>
            Please ensure your upload is no larger than 25MB
          </Text>
        </Pressable>
      ) : (
        <View style={styles.mainImageWrapper}>
          <FastImage
            source={{
              uri:
                images[selectedIndex]?.sourceURL || images[selectedIndex]?.path,
            }}
            style={styles.mainImage}
            // resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      )}

      {images.length > 0 && (
        <View style={styles.imageListContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images?.map((item, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Pressable onPress={() => setSelectedIndex(index)}>
                  <FastImage
                    source={{uri: item?.sourceURL || item?.path}}
                    style={[
                      styles.imageContainer,
                      selectedIndex === index && styles.selectedThumb,
                    ]}
                  />
                </Pressable>
                <Pressable
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}>
                  <CrossIcon fill={'#ffffff'} height={12} />
                </Pressable>
              </View>
            ))}
            <Pressable onPress={handleImages} style={styles.addImageContainer}>
              <Text style={styles.addImageText}>+</Text>
            </Pressable>
          </ScrollView>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {isEdit ? (
          <CustomButton
            isLoading={loadingPublish}
            text="Update"
            onPress={handlePublish}
            btnStyle={{width: '100%', backgroundColor: Colors.white}}
            textStyle={{color: Colors.black}}
          />
        ) : (
          <>
            <CustomButton
              isLoading={loadingDraft}
              text="Save Draft"
              onPress={handleSaveDraft}
              disabled={images?.length == 0}
              btnStyle={
                images?.length == 0
                  ? {opacity: 0.5, width: '48%'}
                  : {opacity: 1, backgroundColor: Colors.white, width: '48%'}
              }
              textStyle={
                images?.length == 0
                  ? {color: 'rgba(255, 255, 255, 0.5)'}
                  : {color: Colors.black}
              }
            />
            <CustomButton
              isLoading={loadingPublish}
              text="Publish"
              onPress={handlePublish}
              disabled={images?.length == 0}
              btnStyle={
                images?.length == 0
                  ? {opacity: 0.5, width: '48%'}
                  : {opacity: 1, backgroundColor: Colors.white, width: '48%'}
              }
              textStyle={
                images?.length == 0
                  ? {color: 'rgba(255, 255, 255, 0.5)'}
                  : {color: Colors.black}
              }
            />
          </>
        )}
      </View>
    </View>
  );
};

export default ProductMedia;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  uploadContainer: {
    height: height * 0.4,
    borderWidth: 2,
    borderColor: '#8C8A94',
    borderRadius: 10,
    padding: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    borderStyle: 'dashed',
  },
  mainImageWrapper: {
    height: height * 0.4,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.black,
  },
  mainImage: {
    width: '100%',
    height: '100%',
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
  imageListContainer: {
    paddingHorizontal: 16,
    alignSelf: 'center',
    height: 100,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    borderRadius: 10,
  },
  selectedThumb: {
    borderColor: Colors.white,
    borderWidth: 2,
  },
  removeButton: {
    position: 'absolute',
    right: -2,
    top: 1,
    backgroundColor: '#FF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: fontSize.f12,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  addImageContainer: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  addImageText: {
    fontSize: fontSize.f22,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
});
