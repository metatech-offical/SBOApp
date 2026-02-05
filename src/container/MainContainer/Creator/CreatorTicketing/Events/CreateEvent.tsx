import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {fonts} from '@constant/fontfamily';
import {CreateEventProps} from '@navigation/screens';
import {useUploadCoverImageMutation} from '@rtkServices/ShortsService';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {View, StyleSheet} from 'react-native';
import EventInformation from '@components/ScreenLayouts/CreatorEventComp/EventInformation';
import TicketInformation from '@components/ScreenLayouts/CreatorEventComp/TicketInformation';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {useCreateEventMutation} from '@rtkServices/CreatorTicketingService';
import {useToastMessage} from '@hooks/useToastMessage';

const CreateEvent = ({navigation, route}: CreateEventProps) => {
  const {showError} = useToastMessage();
  const [activeStep, setActiveStep] = useState(1);
  const [eventData, setEventData] = useState<any>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadImage] = useUploadCoverImageMutation();
  const [createEvent, {isLoading: isCreatingEvent}] = useCreateEventMutation();
  const {control, handleSubmit, unregister, setValue} = useForm({
    defaultValues: {
      event_Name: '',
      date_time: '',
      location: '',
      description: '',
      category: '',
      publish_date_time: '',
      tickets: [],
      currency: 'USD',
    },
    mode: 'onChange',
  });

  const handleUpload = async (imageData: any) => {
    try {
      const result = await uploadImage(imageData).unwrap();
      const imageUrl = result?.data;
      if (imageUrl) {
        return imageUrl;
      }
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const handleNextStep = (data: any) => {
    setEventData(data);
    setActiveStep(2);
  };

  const handlePublish = async (ticketData: any) => {
    setIsPublishing(true);
    try {
      // Validate publish date is not greater than event date
      const publishDate = new Date(eventData.publish_date_time);
      const eventDate = new Date(eventData.date_time);
      if (publishDate > eventDate) {
        showError('Publish date cannot be later than event date');
        setIsPublishing(false);
        return;
      }

      let coverImageUrl = '';
      if (eventData?.coverImage) {
        const uploadedUrl = await handleUpload(eventData.coverImage);
        if (uploadedUrl) {
          coverImageUrl = uploadedUrl;
        } else {
          showError('Failed to upload cover image');
          setIsPublishing(false);
          return;
        }
      }
      let arenaImageUrl = '';
      if (ticketData?.arenaImage) {
        const uploadedArenaUrl = await handleUpload(ticketData.arenaImage);
        if (uploadedArenaUrl) {
          arenaImageUrl = uploadedArenaUrl;
        } else {
          showError('Failed to upload arena image');
          setIsPublishing(false);
          return;
        }
      }
      const ticketsArray: Array<{
        ticketName: string;
        originalPrice: number;
        numberOfTickets: number;
      }> = [];

      if (ticketData.tickets) {
        Object.keys(ticketData.tickets).forEach(ticketKey => {
          const ticket = ticketData.tickets[ticketKey];
          if (ticket.name && ticket.price && ticket.count) {
            ticketsArray.push({
              ticketName: ticket.name,
              originalPrice: parseFloat(ticket.price) || 0,
              numberOfTickets: parseInt(ticket.count, 10) || 0,
            });
          }
        });
      }
      if (ticketsArray.length === 0) {
        showError('Please add at least one ticket');
        setIsPublishing(false);
        return;
      }
      const locationData = {
        coordinates: {lat: 0, lng: 0},
        zipCode: 0,
        address: eventData?.location || '',
      };

      // Prepare complete event payload matching CreateEventPayload interface
      const completePayload: CreateEventPayload = {
        eventCoverImageUrl: coverImageUrl,
        eventArenaImageUrl: arenaImageUrl,
        eventName: eventData?.event_Name || '',
        eventDateTime: eventData?.date_time || '',
        eventPublishOnDate: eventData?.publish_date_time || '',
        eventDescription: eventData?.description || '',
        eventLocation: locationData,
        eventCategory: eventData?.category?.name || '',
        eventCurrencyType: ticketData?.currency?.value || 'USD',
        tickets: ticketsArray,
      };
      // Call API to create event
      const response = await createEvent(completePayload).unwrap();

      if (response?.success) {
        navigation.goBack();
      }
    } catch (error: any) {
      console.log('Error publishing event:', error);
      showError(
        error?.data?.message || error?.message || 'Failed to create event',
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleImagesChange = (newImages: any[]) => {
    // Handle single image for tracking
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
      />
      <View style={styles.contentOverlay}>
        <StackHeader
          title={'Create Event'}
          onBackPress={() => navigation.goBack()}
        />

        {activeStep === 1 ? (
          <EventInformation
            control={control}
            onImagesChangeEvent={handleImagesChange}
            handleSubmit={handleSubmit}
            onNextStep={handleNextStep}
          />
        ) : (
          <TicketInformation
            control={control}
            loading={isPublishing || isCreatingEvent}
            handleSubmit={handleSubmit}
            onPublish={handlePublish}
            onImagesChange={handleImagesChange}
            unregister={unregister}
            setValue={setValue}
          />
        )}
      </View>
    </View>
  );
};

export default CreateEvent;

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
  progressBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
});
