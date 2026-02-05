import CustomButton from '@components/CustomButtons/CustomButton';
import CustomDropDown from '@components/DropDown/CustomDropDown';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import {Controller} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {currencies} from '@utils/data';
import {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Colors} from '@constant/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomImagePicker from '@components/CustomImagePicker/ImagePicker';

interface TicketInformationProps {
  loading: boolean;
  control: any;
  onPublish?: (data: any) => void;
  handleSubmit: any;
  onImagesChange: (image: any) => void;
  unregister?: any;
  setValue?: any;
}

const TicketInformation = ({
  loading,
  control,
  onPublish,
  handleSubmit,
  onImagesChange,
  unregister,
  setValue,
}: TicketInformationProps) => {
  const [imageData, setImageData] = useState<any>();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [tickets, setTickets] = useState<number[]>([0]); // Start with one ticket

  const handlePublish = (data: any) => {
    if (onPublish) {
      // Filter out only existing tickets from the data
      const filteredTickets: any = {};
      tickets.forEach((ticketIndex, index) => {
        const ticketKey = `ticket_${ticketIndex}`;
        if (data.tickets && data.tickets[ticketKey]) {
          filteredTickets[`ticket_${index}`] = data.tickets[ticketKey];
        }
      });

      // Include arena image in the payload
      const payloadWithImage = {
        ...data,
        tickets: filteredTickets,
        arenaImage: imageData || null,
      };
      onPublish(payloadWithImage);
    }
  };

  const handleImageSelect = (item: any) => {
    setPickerOpen(false);
    setImageData(item);
    onImagesChange([item]);
  };

  const addNewTicket = () => {
    const newTicketIndex = Math.max(...tickets) + 1;
    setTickets([...tickets, newTicketIndex]);
  };

  const removeTicket = (index: number) => {
    if (tickets.length > 1) {
      const ticketIndexToRemove = tickets[index];

      // Unregister form fields for this ticket
      if (unregister) {
        unregister(`tickets.ticket_${ticketIndexToRemove}.name`);
        unregister(`tickets.ticket_${ticketIndexToRemove}.price`);
        unregister(`tickets.ticket_${ticketIndexToRemove}.count`);
      }

      setTickets(tickets.filter((_, i) => i !== index));
    }
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.formContainer}>
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
              <Text style={styles.uploadText}>Upload arena image</Text>
            </>
          )}
        </Pressable>
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>Ticket Information</Text>
          <View style={styles.rightHeaderSection}>
            <TouchableOpacity
              hitSlop={20}
              style={styles.viewInstructionsContainer}
              onPress={() => setShowInstructions(true)}>
              <Text style={styles.viewInstructionsText}>View instructions</Text>
            </TouchableOpacity>
            <Controller
              control={control}
              name="currency"
              render={({field: {onChange, value}}) => (
                <CustomDropDown
                  defaultValue={value}
                  data={currencies}
                  placeHolder="USD"
                  onSelect={onChange}
                  commonStyle={{width: 120, height: 45}}
                />
              )}
            />
          </View>
        </View>

        {tickets.map((ticketIndex, index) => (
          <View key={ticketIndex} style={styles.ticketTypeContainer}>
            <View style={styles.ticketHeaderRow}>
              <Text style={styles.ticketTypeLabel}>Ticket {index + 1}</Text>
              {tickets.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeTicket(index)}
                  style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>

            <Controller
              control={control}
              name={`tickets.ticket_${ticketIndex}.name`}
              rules={{required: 'Ticket name is required'}}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  label="Ticket Name"
                  placeholder="Enter ticket name"
                  onChangeText={onChange}
                  value={value}
                  error={error?.message}
                  btnStyle={styles.inputContainer}
                />
              )}
            />

            <Controller
              control={control}
              name={`tickets.ticket_${ticketIndex}.price`}
              rules={{required: 'Ticket price is required'}}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  label="Ticket Price"
                  placeholder="Enter price"
                  onChangeText={onChange}
                  value={value}
                  error={error?.message}
                  btnStyle={styles.inputContainer}
                  keyboardType="numeric"
                />
              )}
            />

            <Controller
              control={control}
              name={`tickets.ticket_${ticketIndex}.count`}
              rules={{required: 'Number of tickets is required'}}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  label="No. of Tickets"
                  placeholder="Enter number of tickets"
                  onChangeText={onChange}
                  value={value}
                  error={error?.message}
                  btnStyle={styles.inputContainer}
                  keyboardType="numeric"
                />
              )}
            />
          </View>
        ))}

        <TouchableOpacity onPress={addNewTicket} style={styles.addTicketButton}>
          <Text style={styles.addTicketButtonText}>+ Add Another Ticket</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <CustomButton
            isLoading={loading}
            disabled={loading}
            text="Save"
            onPress={handleSubmit(handlePublish)}
            btnStyle={{width: '100%', backgroundColor: Colors.white}}
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

      {/* Instructions Modal */}
      <Modal
        visible={showInstructions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInstructions(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.instructionsImageContainer}>
              <Image
                source={require('@assets/images/TicketViewinstructions.png')}
                style={styles.instructionsImage}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => setShowInstructions(false)}>
            <Text style={styles.dismissButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

export default TicketInformation;

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 120,
    flexGrow: 1,
  },
  formContainer: {
    padding: 16,
  },
  container: {
    marginHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    flex: 1,
  },
  rightHeaderSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  viewInstructionsContainer: {
    marginBottom: 4,
  },
  viewInstructionsText: {
    color: Colors.grey,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    textDecorationLine: 'underline',
  },

  ticketTypeContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(164, 163, 163, 0.2)',
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  ticketTypeLabel: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: 'rgba(109, 116, 247, 1)',
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#FF3B30',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  addTicketButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(109, 116, 247, 0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(109, 116, 247, 0.4)',
    alignItems: 'center',
    marginBottom: 20,
  },
  addTicketButtonText: {
    color: 'rgba(109, 116, 247, 1)',
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgba(164, 163, 163, 0.33)',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 1.5},
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    marginBottom: 10,
  },
  uploadContainer: {
    height: 230,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.80)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 450,
    backgroundColor: '#1a1538',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  instructionsImageContainer: {
    width: '100%',
    height: 350,
    marginBottom: 20,
  },
  instructionsImage: {
    width: '100%',
    height: '100%',
  },
  dismissButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
  },
});
