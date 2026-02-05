import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '@constant/colors';
import {fontSize, hp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {TouchableOpacity} from 'react-native';
import CustomDatePicker from '@components/CustomDateInputs/DateInput';
import {ActivityFilterData} from '@utils/data';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
function MyActivityFilter({
  closeBottomSheet,
  onApplyFilter,
  ActivityFilter,
}: MyActivityFilterProps): React.ReactElement {
  const {top} = useSafeAreaInsets();
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>({
    fromDate: ActivityFilter.fromDate || null,
    toDate: ActivityFilter.toDate || null,
    filter: ActivityFilter.filter || null,
  });
  const handleApplyFilter = (): void => {
    onApplyFilter(activityFilter);
    closeBottomSheet();
  };
  const handleClearFilter = (): void => {
    setActivityFilter({
      fromDate: null,
      toDate: null,
      filter: null,
    });
  };
  const handleFromDateChange = (date: Date | null): void => {
    setActivityFilter({
      ...activityFilter,
      fromDate: date,
    });
  };
  const handleToDateChange = (date: Date | null): void => {
    setActivityFilter({
      ...activityFilter,
      toDate: date,
    });
  };
  const handleFilterSelect = (value: string): void => {
    if (activityFilter.filter === value) {
      setActivityFilter({
        ...activityFilter,
        filter: null,
      });
      return;
    } else {
      setActivityFilter({
        ...activityFilter,
        filter: value,
      });
    }
  };
  return (
    <View style={[styles.container, {top: top}]}>
      <Text style={styles.filterHeaderText}>Filter by:</Text>
      {/* Date Picker Section */}
      <View style={styles.datePickerContainer}>
        <CustomDatePicker
          onDateChange={handleFromDateChange}
          initialDate={activityFilter.fromDate}
          maxDate={new Date()}
          label="From"
          style={styles.datePicker}
        />
        <CustomDatePicker
          onDateChange={handleToDateChange}
          initialDate={activityFilter.toDate}
          maxDate={new Date()}
          label="To"
          style={styles.datePicker}
        />
      </View>
      {/* Filter Buttons */}
      <View style={styles.filterButtonsContainer}>
        {ActivityFilterData.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleFilterSelect(item.value)}
            style={[
              styles.filterButton,
              activityFilter.filter === item.value && styles.activeFilterButton,
            ]}>
            <Text style={styles.filterButtonText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearFilter}>
          <Text style={styles.filterButtonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyFilterButton}
          onPress={handleApplyFilter}>
          <Text style={styles.applyButtonText}>Apply Filter </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default React.memo(MyActivityFilter);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: hp('2%'),
  },
  filterHeaderText: {
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Regular'],
    marginTop: hp('2%'),
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },
  datePicker: {
    width: '45%',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },
  filterButton: {
    width: '30%',
    height: hp('7%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF0A',
  },
  activeFilterButton: {
    backgroundColor: '#FFFFFF0A',
  },
  filterButtonText: {
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Regular'],
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('3%'),
    paddingTop: hp('2%'),
    borderTopWidth: 1,
    borderColor: '#FFFFFF0A',
  },
  clearButton: {
    width: '30%',
    height: hp('6%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEF24',
  },
  applyFilterButton: {
    backgroundColor: Colors.white,
    width: '65%',
    height: hp('6%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: Colors.black,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
  },
});
