import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {EditCoverScreenProps} from '@navigation/screens';
import {Colors} from '@constant/colors';
import StackHeader from '@components/CustomHeaders/StackHeader';
import LinearGradient from 'react-native-linear-gradient';
import {createThumbnail} from 'react-native-create-thumbnail';
import FastImage from 'react-native-fast-image';
import {fonts} from '@constant/fontfamily';
import {fontSize, width} from '@constant/fontSize';
import CustomButton from '@components/CustomButtons/CustomButton';
import CustomImagePicker from '@components/CustomImagePicker/ImagePicker';
import {calculateDynamicTimestamps} from '@utils/general';

interface ThumbnailData {
  path: string;
  timestamp: number;
}

const EditCoverScreen = ({navigation, route}: EditCoverScreenProps) => {
  const {videoUrl, data, currentCover, currentTimestamp, screenType, formData} =
    route?.params || {};
  const [thumbnails, setThumbnails] = useState<ThumbnailData[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string>(
    currentCover || '',
  );
  const [selectedTimestamp, setSelectedTimestamp] = useState<number | null>(
    currentTimestamp || null,
  );
  const [loading, setLoading] = useState(!currentCover);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (videoUrl) {
      generateThumbnails();
    }
  }, [videoUrl]);

  const generateThumbnails = async () => {
    if (!currentCover) {
      setLoading(true);
    }
    try {
      // Duration is already in milliseconds in the new data structure
      const videoDuration = data?.duration || 32000;
      const timestamps = calculateDynamicTimestamps(videoDuration);
      const thumbnailPromises = timestamps?.map(async timestamp => {
        try {
          const result = await createThumbnail({
            url: videoUrl,
            format: 'png',
            timeStamp: timestamp,
          });
          return {path: result.path, timestamp};
        } catch (error) {
          console.error(`Failed to create thumbnail at ${timestamp}:`, error);
          return null;
        }
      });

      const results = await Promise.all(thumbnailPromises);
      const validThumbnails = results.filter(
        (item): item is ThumbnailData => item !== null,
      );
      setThumbnails(validThumbnails);

      // If we have a currentTimestamp, find and select the matching thumbnail
      if (currentTimestamp !== null && validThumbnails.length > 0) {
        const matchingThumbnail = validThumbnails.find(
          t => t.timestamp === currentTimestamp,
        );
        if (matchingThumbnail) {
          setSelectedThumbnail(matchingThumbnail.path);
          setSelectedTimestamp(matchingThumbnail.timestamp);
        }
      } else if (validThumbnails.length > 0 && !currentCover) {
        setSelectedThumbnail(validThumbnails[0].path);
        setSelectedTimestamp(validThumbnails[0].timestamp);
      }
    } catch (error) {
      console.error('Error generating thumbnails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFromGallery = () => {
    setPickerOpen(true);
  };

  const handleDone = () => {
    // Navigate back to the correct screen based on screenType
    if (screenType === 'video') {
      navigation.navigate('VideoUploadScreen', {
        data: data,
        selectedCover: selectedThumbnail,
        timestamp: selectedTimestamp,
        formData: formData,
      });
    } else {
      navigation.navigate('ShortsUploadScreen', {
        data: data,
        selectedCover: selectedThumbnail,
        timestamp: selectedTimestamp,
        formData: formData,
      });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A0A47', '#100E12']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFillObject}
      />
      <StackHeader
        title="Edit"
        onBackPress={() => navigation.goBack()}
        rightIcon={true}
        onRightPress={handleAddFromGallery}
        showArrowDown={false}
        icon={
          <FastImage
            source={require('@assets/images/gallaryImage.png')}
            style={styles.galleryIcon}
            resizeMode="contain"
          />
        }
        rightIconText="Add from gallery"
        rightIconTextStyle={styles.rightIconTextStyle}
        rightIconStyle={styles.rightIconStyle}
        titleStyle={{width: '45%'}}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Main Preview */}
          <View style={styles.previewContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.white} />
                <Text style={styles.loadingText}>Generating frames...</Text>
              </View>
            ) : selectedThumbnail ? (
              <FastImage
                source={{uri: selectedThumbnail}}
                style={styles.previewImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>No preview available</Text>
              </View>
            )}
          </View>

          {/* Description Text */}
          <Text style={styles.descriptionText}>
            Select a cover image from your video or gallery
          </Text>

          {/* Thumbnails Scrollable List - COMMENTED OUT */}
          {/* {!loading && thumbnails.length > 0 && (
            <View style={styles.thumbnailSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailScrollContent}>
                {thumbnails.map((thumbnail, index) => {
                  const isSelected =
                    selectedTimestamp !== null
                      ? thumbnail.timestamp === selectedTimestamp
                      : selectedThumbnail === thumbnail.path;

                  return (
                    <Pressable
                      key={index}
                      onPress={() => {
                        setSelectedThumbnail(thumbnail.path);
                        setSelectedTimestamp(thumbnail.timestamp);
                      }}
                      style={[
                        styles.thumbnailWrapper,
                        isSelected && styles.selectedThumbnailWrapper,
                      ]}>
                      <FastImage
                        source={{uri: thumbnail.path}}
                        style={styles.thumbnail}
                        resizeMode="cover"
                      />
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )} */}
        </View>
      </ScrollView>
      {/* Done Button */}
      <View style={styles.buttonContainer}>
        <CustomButton
          text="Done"
          onPress={handleDone}
          textStyle={styles.buttonText}
          btnStyle={styles.doneButton}
          disabled={!selectedThumbnail}
        />
      </View>
      {/* Image Picker */}
      {pickerOpen && (
        <CustomImagePicker
          selectedCancel={() => setPickerOpen(false)}
          selectedValue={(item: any) => {
            setPickerOpen(false);
            setSelectedThumbnail(item.path);
            setSelectedTimestamp(null); // Gallery images don't have timestamps
          }}
          mediaType="photo"
          screenType={screenType}
        />
      )}
    </View>
  );
};

export default EditCoverScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  galleryIcon: {
    width: 16,
    height: 16,
  },
  previewContainer: {
    width: (width - 64) * 0.8,
    height: (width - 64) * 1.77 * 0.8,
    // backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: Colors.black,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: Colors.grey,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
  },
  descriptionText: {
    color: Colors.grey,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    textAlign: 'center',
    marginBottom: 20,
  },
  thumbnailSection: {
    marginBottom: 20,
  },
  thumbnailScrollContent: {
    paddingHorizontal: 0, // remove side padding
  },
  thumbnailWrapper: {
    width: 64,
    height: 96,
    overflow: 'hidden',
    borderColor: 'transparent',
  },
  selectedThumbnailWrapper: {
    borderColor: '#1AD655',
    borderWidth: 4,
    borderRadius: 6,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  doneButton: {
    backgroundColor: Colors.white,
  },
  buttonText: {
    color: Colors.black,
    fontFamily: fonts['Poppins-SemiBold'],
    fontSize: fontSize.f16,
  },
  rightIconTextStyle: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  rightIconStyle: {
    width: 170,
  },
});
