import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Modal,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {fontSize, hp, wp} from '../../constant/fontSize';
import {fonts} from '../../constant/fontfamily';
import {InputCalendarIcon} from '@assets/svg/CommonIcons';
import { Colors } from '@constant/colors';

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  style,
  onDateChange,
  initialDate = null,
  minDate = new Date(2020, 0, 1),
  maxDate = new Date(2030, 11, 31),
  label,
}) => {
  const [date, setDate] = useState<Date | null>(initialDate);
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && selectedDate) {
        setDate(selectedDate);
        onDateChange(selectedDate);
      }
    } else {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      if (currentDate) onDateChange(currentDate);
    }
  };

  const toggleDatepicker = (): void => {
    setShowPicker(!showPicker);
  };

  const handleConfirm = (): void => {
    if (date) onDateChange(date);
    setShowPicker(false);
  };

  const handleCancel = (): void => {
    setShowPicker(false);
  };

  const handleClear = (): void => {
    setDate(null);
    onDateChange(null);
    setShowPicker(false);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label || 'Select Date'}</Text>
        {/* {date && (
          <Text
            onPress={handleClear}
            style={[styles.label, {color: Colors.red, fontSize: fontSize.f14}]}>
            Clear
          </Text>
        )} */}
      </View>

      <TouchableOpacity onPress={toggleDatepicker} style={styles.pickerButton}>
        <Text style={[styles.dateText, !date && styles.placeholderText]}>
          {date ? date.toISOString().split('T')[0] : 'Select Date'}
        </Text>
        <View style={styles.calendarIcon}>
          <InputCalendarIcon />
        </View>
      </TouchableOpacity>

      {showPicker &&
        (Platform.OS === 'ios' ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showPicker}
            onRequestClose={handleCancel}>
            <View style={styles.modalContainer}>
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="spinner"
                onChange={onChange}
                style={styles.datePicker}
                minimumDate={minDate}
                maximumDate={maxDate}
                themeVariant="dark"
              />
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={styles.modalFooterButton}>
                  <Text style={styles.modalFooterButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  style={[
                    styles.modalFooterButton,
                    styles.modalFooterButtonConfirm,
                  ]}>
                  <Text style={styles.modalFooterButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={onChange}
            minimumDate={minDate}
            maximumDate={maxDate}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 0,
  },
  label: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    opacity: 0.5,
  },
  labelContainer: {
    marginBottom: hp('0.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButton: {
    // backgroundColor: '#111519',
    borderRadius: 12,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
    paddingLeft: wp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF0A',
  },
  dateText: {
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Regular'],
  },
  placeholderText: {
    color: '#666',
  },
  datePicker: {
    height: 120,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#13181C',
    paddingVertical: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  modalFooterButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalFooterButtonConfirm: {
    backgroundColor: '#A442F1',
  },
  modalFooterButtonClear: {
    backgroundColor: '#FF4444',
  },
  modalFooterButtonText: {
    color: Colors.white,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Regular'],
  },
  calendarIcon: {
    backgroundColor: '#FFFFFF0A',
    padding: hp('1.5%'),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomDatePicker;
