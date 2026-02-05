import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import CustomTimePicker from './CustomTimePicker';
import dayjs from 'dayjs';

interface DateTimePickerInputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  onChange?: (dateTime: string) => void;
  error?: string;
  containerStyle?: StyleProp<ViewStyle> | undefined;
  inputContainerStyle?: StyleProp<ViewStyle> | undefined;
  customBtn?: React.ReactElement;
}

const DateTimePickerInput = ({
  label,
  value,
  placeholder = 'Select date & time',
  onChange,
  error,
  containerStyle,
  customBtn,
  inputContainerStyle
}: DateTimePickerInputProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getCurrentTime = () => {
    const now = dayjs();
    return now.format('hh:mm A');
  };

  const handleModalOpen = () => {
    // Set defaults to current date and time
    if (!selectedDate) {
      setSelectedDate(getCurrentDate());
    }
    if (!selectedTime) {
      setSelectedTime(getCurrentTime());
    }
    setShowModal(true);
  };

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const mergeDateTime = (dateStr: string, timeStr: string) => {
    // Parse time string (format: "HH:MM AM/PM")
    const timeParts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeParts) return '';

    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    const isPM = timeParts[3].toUpperCase() === 'PM';

    // Convert to 24-hour format
    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }

    // Create local date time without UTC conversion
    const dateTime = dayjs(
      `${dateStr} ${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`,
      'YYYY-MM-DD HH:mm',
    );
    return dateTime.format();
  };

  const handleConfirm = () => {
    const dateToUse = selectedDate || getCurrentDate();
    const timeToUse = selectedTime || getCurrentTime();

    const utcDateTime = mergeDateTime(dateToUse, timeToUse);
    onChange?.(utcDateTime);
    setShowModal(false);
    setSelectedDate('');
    setSelectedTime('');
  };

  const formatDisplayValue = (isoString: string) => {
    if (!isoString) return '';
    // Parse and display the date time as is (no timezone conversion)
    const localDate = dayjs(isoString);
    return localDate.format('MMM DD, YYYY hh:mm A');
  };

  return (
    <View
      style={{
        ...styles.container,
        ...(typeof containerStyle == 'object' && containerStyle),
      }}>
      {React.isValidElement(customBtn) ? (
        <Pressable style={{...styles.inputContainer, ...(typeof inputContainerStyle == 'object' && inputContainerStyle),}} onPress={handleModalOpen}>
          {customBtn}
        </Pressable>
      ) : (
        <>
          {label && <Text style={styles.label}>{label}</Text>}
          <Pressable style={styles.inputContainer} onPress={handleModalOpen}>
            <Text style={[styles.inputText, !value && styles.placeholder]}>
              {value ? formatDisplayValue(value) : placeholder}
            </Text>
          </Pressable>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </>
      )}

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}>
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}>
            {/* Calendar Section */}
            <Text style={styles.sectionTitle}>Select Date</Text>
            <Calendar
              current={getCurrentDate()}
              minDate={getCurrentDate()}
              onDayPress={handleDateSelect}
              markedDates={
                selectedDate
                  ? {
                      [selectedDate]: {
                        selected: true,
                        selectedColor: 'rgba(109, 116, 247, 1)',
                      },
                    }
                  : {}
              }
              theme={{
                backgroundColor: 'transparent',
                calendarBackground: '#1a1538',
                textSectionTitleColor: '#9ca3af',
                selectedDayBackgroundColor: 'rgba(109, 116, 247, 1)',
                selectedDayTextColor: '#ffffff',
                todayTextColor: 'rgba(109, 116, 247, 1)',
                dayTextColor: '#e5e7eb',
                textDisabledColor: '#4b5563',
                arrowColor: '#9ca3af',
                monthTextColor: '#ffffff',
                textDayFontFamily: fonts['Poppins-Regular'],
                textMonthFontFamily: fonts['Poppins-SemiBold'],
                textDayHeaderFontFamily: fonts['Poppins-Medium'],
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 12,
              }}
              style={styles.calendar}
            />

            {/* Time Picker Section */}
            <View style={styles.timeSection}>
              <Text style={styles.sectionTitle}>Select Time</Text>
              <CustomTimePicker
                onTimeSelected={handleTimeSelect}
                initialTime={
                  value ? dayjs(value).toISOString() : dayjs().toISOString()
                }
                selectedDate={selectedDate || getCurrentDate()}
                enableLimit={false}
              />
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
export default DateTimePickerInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    color: '#EEEEEE',
    fontSize: fontSize.f14,
    marginBottom: 8,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgba(164, 163, 163, 0.33)',
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  inputText: {
    color: Colors.white,
    fontSize: fontSize.f13,
    fontFamily: fonts['Poppins-Regular'],
  },
  placeholder: {
    color: Colors.grey,
  },
  errorText: {
    color: Colors.red,
    fontSize: fontSize.f12,
    marginTop: 5,
    fontFamily: fonts['Poppins-Regular'],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1538',
    borderRadius: 16,
    padding: 16,
    width: '90%',
    maxWidth: 400,
  },
  calendar: {
    borderRadius: 12,
    backgroundColor: '#1a1538',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    marginBottom: 12,
    marginTop: 8,
  },
  timeSection: {
    marginTop: 16,
  },
  confirmButton: {
    backgroundColor: 'rgba(109, 116, 247, 1)',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonDisabled: {
    backgroundColor: 'rgba(109, 116, 247, 0.4)',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
  },
});
