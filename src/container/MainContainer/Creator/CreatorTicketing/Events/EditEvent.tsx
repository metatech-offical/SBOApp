import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {EditEventProps} from '@navigation/screens';
import Loader from '@components/CustomLoader/Loader';
import {
  useGetEventDetailByIdQuery,
  useUpdateEventByIdMutation,
  useCancelEventByIdMutation,
} from '@rtkServices/CreatorTicketingService';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import {useForm} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Controller} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import DateTimePickerInput from '@components/DateTimePicker/DateTimePickerInput';
import CustomDropDown from '@components/DropDown/CustomDropDown';
import {UploadCategoryData} from '@utils/data';
import CustomButton from '@components/CustomButtons/CustomButton';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import FastImage from 'react-native-fast-image';
import {Pressable, Text} from 'react-native';
import CustomImagePicker from '@components/CustomImagePicker/ImagePicker';
import {useUploadCoverImageMutation} from '@rtkServices/ShortsService';
import {useToastMessage} from '@hooks/useToastMessage';
import EditEventHeader from '@components/CustomHeaders/EditEventHeader';
import {CommonActions} from '@react-navigation/native';
import {navigateAndSimpleReset} from '@navigation/utils';

const EditEvent = ({navigation, route}: EditEventProps) => {
  const {eventId} = route?.params as {eventId: string};
  const {showSuccess, showError} = useToastMessage();
  const {data: eventData, isLoading} = useGetEventDetailByIdQuery({
    eventId,
  });
  const [updateEvent, {isLoading: isUpdating}] = useUpdateEventByIdMutation();
  const [cancelEvent] = useCancelEventByIdMutation();
  const [uploadImage] = useUploadCoverImageMutation();
  const [imageData, setImageData] = useState<any>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [eventStatus, setEventStatus] = useState<string>('Scheduled');

  const eventDetail = eventData?.data?.event || {};

  const {control, handleSubmit, reset, watch} = useForm({
    defaultValues: {
      event_Name: '',
      date_time: '',
      location: '',
      description: '',
      category: '',
      publish_date_time: '',
    },
    mode: 'onChange',
  });

  const eventDateTime = watch('date_time');

  // Prefill form when data is loaded
  useEffect(() => {
    if (eventDetail && Object.keys(eventDetail).length > 0) {
      // Find matching category from dropdown data
      const matchingCategory = UploadCategoryData.find(
        cat => cat.name === eventDetail.eventCategory,
      );

      reset({
        event_Name: eventDetail.eventName || '',
        date_time: eventDetail.eventDateTime || '',
        location: eventDetail.eventLocation?.address || '',
        description: eventDetail.eventDescription || '',
        category: (matchingCategory as any) || '',
        publish_date_time: eventDetail.eventPublishOnDate || '',
      });

      // Set existing cover image
      if (eventDetail.eventCoverImageUrl) {
        setImageData({
          sourceURL: eventDetail.eventCoverImageUrl,
          path: eventDetail.eventCoverImageUrl,
        });
      }

      // Set existing event status
      if (eventDetail.eventStatus) {
        setEventStatus(eventDetail.eventStatus);
      }
    }
  }, [eventDetail, reset]);

  const handleImageSelect = (item: any) => {
    setPickerOpen(false);
    setImageData(item);
  };

  const handleUpload = async (imgData: any) => {
    try {
      const result = await uploadImage(imgData).unwrap();
      const imageUrl = result?.data;
      if (imageUrl) {
        return imageUrl;
      }
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const handleCancelEvent = async () => {
    try {
      const response = await cancelEvent({
        eventId,
        reason: 'Event cancelled by creator',
      }).unwrap();
      if (response?.success) {
        showSuccess(response?.message || 'Event cancelled successfully');
        navigation.reset({
          index: 0,
          routes: [{name: 'MainNavigator'}],
        });
      }
    } catch (error: any) {
      console.log('Error cancelling event:', error);
      showError(
        error?.data?.message || error?.message || 'Failed to cancel event',
      );
    }
  };

  const onSubmit = async (data: any) => {
    try {
      // Validate publish date is not greater than event date
      const publishDate = new Date(data.publish_date_time);
      const eventDate = new Date(data.date_time);
      if (publishDate > eventDate) {
        showError('Publish date cannot be later than event date');
        return;
      }

      let coverImageUrl = eventDetail.eventCoverImageUrl || '';

      // Upload new image if user selected one (check if it's a local file, not S3 URL)
      if (
        imageData &&
        imageData.sourceURL &&
        !imageData.sourceURL.startsWith('http')
      ) {
        const uploadedUrl = await handleUpload(imageData);
        if (uploadedUrl) {
          coverImageUrl = uploadedUrl;
        } else {
          showError('Failed to upload cover image');
          return;
        }
      }

      const locationData = {
        coordinates: eventDetail.eventLocation?.coordinates || {lat: 0, lng: 0},
        zipCode: eventDetail.eventLocation?.zipCode || 0,
        address: data?.location || '',
      };

      const updatePayload = {
        eventCoverImageUrl: coverImageUrl,
        eventName: data?.event_Name || '',
        eventDateTime: data?.date_time || '',
        eventPublishOnDate: data?.publish_date_time || '',
        eventDescription: data?.description || '',
        eventLocation: locationData,
        eventCategory: data?.category?.name || '',
      };

      const response = await updateEvent({
        eventId,
        body: updatePayload,
      }).unwrap();
      if (response?.success) {
        showSuccess(response?.message || '');
        navigation.goBack();
      }
    } catch (error: any) {
      console.log('Error updating event:', error);
      showError(
        error?.data?.message || error?.message || 'Failed to update event',
      );
    }
  };

  if (isLoading) {
    return <Loader visible={isLoading} />;
  }

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
      />
      <View style={styles.contentOverlay}>
        <EditEventHeader
          navigation={navigation}
          currentStatus={eventStatus}
          onStatusChange={setEventStatus}
          onCancelEvent={handleCancelEvent}
        />

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Event Information</Text>

            <Pressable
              onPress={() => setPickerOpen(true)}
              style={styles.uploadContainer}>
              {imageData ? (
                <FastImage
                  source={{uri: imageData?.path || imageData?.sourceURL}}
                  style={{width: '100%', height: '100%', borderRadius: 10}}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <>
                  <FastImage
                    source={require('@assets/images/gallaryImage.png')}
                    style={styles.uploadIcon}
                  />
                  <Text style={styles.uploadText}>Upload cover image</Text>
                </>
              )}
            </Pressable>

            <Controller
              control={control}
              rules={{
                required: 'Event name field is required',
                minLength: {
                  value: 2,
                  message: 'Event name must be at least 2 characters',
                },
              }}
              name="event_Name"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  label="Event Name"
                  value={value}
                  placeholder="Enter your event's name"
                  onChangeText={onChange}
                  error={error?.message}
                  autoCapitalize="words"
                />
              )}
            />

            <Controller
              control={control}
              rules={{
                required: 'Date & Time field is required',
              }}
              name="date_time"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <DateTimePickerInput
                  label="Date & Time"
                  value={value}
                  placeholder="Select date & time"
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              rules={{
                required: 'Location field is required',
              }}
              name="location"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  label="Location"
                  value={value}
                  placeholder="Location"
                  onChangeText={onChange}
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              rules={{
                required: 'Description field is required',
              }}
              name="description"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  label="Description"
                  value={value}
                  placeholder="Description"
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
                  data={UploadCategoryData || []}
                  placeHolder="Select category"
                  onSelect={onChange}
                  error={error?.message}
                  containerStyle={{marginBottom: 20}}
                />
              )}
            />

            <Controller
              control={control}
              rules={{
                required: 'Publish Date & Time field is required',
                validate: value => {
                  if (!eventDateTime) return true;
                  const publishDate = new Date(value);
                  const eventDate = new Date(eventDateTime);
                  if (publishDate > eventDate) {
                    return 'Publish date cannot be later than event date';
                  }
                  return true;
                },
              }}
              name="publish_date_time"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <DateTimePickerInput
                  label="Publish Date & Time"
                  value={value}
                  placeholder="Select publish date & time"
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />

            <View style={styles.buttonContainer}>
              <CustomButton
                text="Update Event"
                onPress={handleSubmit(onSubmit)}
                isLoading={isUpdating}
                btnStyle={{backgroundColor: Colors.white}}
                textStyle={{color: Colors.black}}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>

        {pickerOpen && (
          <CustomImagePicker
            selectedCancel={() => setPickerOpen(false)}
            selectedValue={handleImageSelect}
          />
        )}
      </View>
    </View>
  );
};

export default EditEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
  },
  scrollViewContent: {
    paddingBottom: 150,
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  uploadContainer: {
    height: 200,
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(88, 88, 88, 0.33)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 10,
  },
  uploadIcon: {
    width: 24,
    height: 24,
  },
  uploadText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
  },
  bioButton: {
    height: 100,
  },
});
