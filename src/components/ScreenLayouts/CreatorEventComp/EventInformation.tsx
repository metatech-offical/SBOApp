import CustomButton from '@components/CustomButtons/CustomButton';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import CustomDropDown from '@components/DropDown/CustomDropDown';
import DateTimePickerInput from '@components/DateTimePicker/DateTimePickerInput';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {UploadCategoryData} from '@utils/data';
import {useState} from 'react';
import {Controller, useWatch} from 'react-hook-form';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomImagePicker from '@components/CustomImagePicker/ImagePicker';
import {useToastMessage} from '@hooks/useToastMessage';

interface ProductInfoProps {
  onNextStep?: (data: any) => void;
  onImagesChangeEvent: (images: any[]) => void;
  control: any;
  handleSubmit: any;
}

const EventInformation = ({
  onNextStep,
  onImagesChangeEvent,
  control,
  handleSubmit,
}: ProductInfoProps) => {
  const [imageData, setImageData] = useState<any>();
  const [pickerOpen, setPickerOpen] = useState(false);
  const {showError} = useToastMessage();

  const eventDateTime = useWatch({
    control,
    name: 'date_time',
  });

  const handleNextStep = (data: any) => {
    // Validate publish date is not greater than event date
    const publishDate = new Date(data.publish_date_time);
    const eventDate = new Date(data.date_time);
    if (publishDate > eventDate) {
      showError('Publish date cannot be later than event date');
      return;
    }

    if (onNextStep) {
      // Include cover image in the payload
      const payloadWithImage = {
        ...data,
        coverImage: imageData || null,
      };
      onNextStep(payloadWithImage);
    }
  };

  const handleImageSelect = (item: any) => {
    setPickerOpen(false);
    setImageData(item);
    onImagesChangeEvent([item]);
  };
  return (
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
            required: 'Product name field is required',
            minLength: {
              value: 2,
              message: 'Product name must be at least 2 characters',
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
            required: 'Category field is required',
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
            text="Save & Next"
            onPress={handleSubmit(handleNextStep)}
            btnStyle={{backgroundColor: Colors.white}}
            textStyle={{color: Colors.black}}
          />
        </View>
      </View>
      {pickerOpen && (
        <CustomImagePicker
          selectedCancel={() => setPickerOpen(false)}
          selectedValue={handleImageSelect}
        />
      )}
    </KeyboardAwareScrollView>
  );
};

export default EventInformation;

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 400,
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
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
  },
  uploadContainer: {
    height: '25%',
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
