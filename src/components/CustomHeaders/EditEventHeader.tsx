import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from 'react-native';
import {fonts} from '@constant/fontfamily';
import {ArrowDown, BackArrow} from '@assets/svg/AuthFlowIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

interface EditEventHeaderProps {
  navigation: any;
  currentStatus?: string;
  onStatusChange?: (status: string) => void;
  onCancelEvent?: () => void;
  onPostponeEvent?: () => void;
}

const EditEventHeader = ({
  navigation,
  currentStatus = 'Scheduled',
  onStatusChange,
  onCancelEvent,
  onPostponeEvent,
}: EditEventHeaderProps) => {
  const {top} = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const statusOptions = [
    {label: 'Scheduled', value: 'Scheduled', color: '#4CAF50'},
    {label: 'Cancelled', value: 'Cancelled', color: '#FF5252'},
    // {label: 'Postponed', value: 'Postponed', color: '#E9F797'},
  ];

  const getStatusColor = (status: string) => {
    // If status is Postponed, return the specific color
    if (status.toLowerCase() === 'postponed') {
      return '#E9F797';
    }
    const option = statusOptions.find(
      opt => opt.value.toLowerCase() === status.toLowerCase(),
    );
    return option?.color || '#4CAF50';
  };

  const handleStatusSelect = (status: string) => {
    setModalVisible(false);

    // If user selects Cancelled or Postponed, show confirmation modal
    if (
      status.toLowerCase() === 'cancelled' ||
      status.toLowerCase() === 'postponed'
    ) {
      setSelectedStatus(status);
      setConfirmModalVisible(true);
    } else {
      // For Scheduled, directly change status
      if (onStatusChange) {
        onStatusChange(status);
      }
    }
  };

  const handleConfirmStatusChange = () => {
    setConfirmModalVisible(false);

    // Call appropriate API based on selected status
    if (selectedStatus.toLowerCase() === 'cancelled' && onCancelEvent) {
      onCancelEvent();
    } else if (
      selectedStatus.toLowerCase() === 'postponed' &&
      onPostponeEvent
    ) {
      onPostponeEvent();
    }

    // Update the UI status
    if (onStatusChange) {
      onStatusChange(selectedStatus);
    }
  };

  const handleCancelStatusChange = () => {
    setConfirmModalVisible(false);
    setSelectedStatus('');
  };

  const getConfirmationMessage = () => {
    if (selectedStatus.toLowerCase() === 'cancelled') {
      return 'Do you want to cancel this event?';
    } else if (selectedStatus.toLowerCase() === 'postponed') {
      return 'Do you want to postpone this event?';
    }
    return '';
  };

  return (
    <View style={[styles.container, {marginTop: top}]}>
      <View style={[styles.row]}>
        <TouchableOpacity
          hitSlop={20}
          onPress={() => navigation.goBack()}
          style={styles.icon}>
          <BackArrow
            color={Colors.white}
            height={20}
            width={20}
            opacity={0.5}
            hitSlop={20}
          />
        </TouchableOpacity>
        <Text numberOfLines={1} style={[styles.textStyle]}>
          Edit Event
        </Text>
      </View>
      <TouchableOpacity
        hitSlop={20}
        style={[styles.rightIcon, {borderColor: getStatusColor(currentStatus)}]}
        onPress={() => setModalVisible(true)}>
        <Text
          style={[
            styles.rightIconText,
            {color: getStatusColor(currentStatus)},
          ]}>
          {currentStatus.charAt(0).toUpperCase() +
            currentStatus.slice(1).toLowerCase()}
        </Text>
        <ArrowDown
          color={getStatusColor(currentStatus)}
          height={16}
          width={16}
        />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContent, {marginTop: top + 60}]}>
            {statusOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  index !== statusOptions.length - 1 &&
                    styles.modalOptionBorder,
                ]}
                onPress={() => handleStatusSelect(option.value)}>
                <Text style={[styles.modalOptionText, {color: option.color}]}>
                  {option.label}
                </Text>
                <ArrowDown color={option.color} height={16} width={16} />
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal
        transparent={true}
        visible={confirmModalVisible}
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}>
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalText}>
              {getConfirmationMessage()}
            </Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity
                style={styles.confirmNoButton}
                onPress={handleCancelStatusChange}>
                <Text style={styles.confirmNoButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmYesButton,
                  {borderColor: getStatusColor(selectedStatus)},
                ]}
                onPress={handleConfirmStatusChange}>
                <Text
                  style={[
                    styles.confirmYesButtonText,
                    {color: getStatusColor(selectedStatus)},
                  ]}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingRight: 20,
    marginTop: 10,
    marginBottom: 10,
    zIndex: 99,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: fontSize.f18,
    alignSelf: 'center',
    marginLeft: 15,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    width: '50%',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  rightIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    minHeight: 40,
    minWidth: 120,
    backgroundColor: '#FFFFFF1A',
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    flexDirection: 'row',
    columnGap: 5,
    paddingHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'rgba(260, 260, 260, 0.09)',
    borderRadius: 12,
    minWidth: 150,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  modalOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalOptionText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    flex: 1,
  },
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  confirmModalContent: {
    backgroundColor: '#1E1A33',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  confirmModalText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  confirmModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmNoButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  confirmNoButtonText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  confirmYesButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    alignItems: 'center',
  },
  confirmYesButtonText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },
});

export default EditEventHeader;
