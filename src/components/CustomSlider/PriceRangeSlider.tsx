import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {Colors} from '@constant/colors';
import {fontSize, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';

const {width} = Dimensions.get('window');

interface PriceRange {
  min: number;
  max: number;
}

interface PriceRangeSliderProps {
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onMinValueChange: (value: number) => void;
  onMaxValueChange: (value: number) => void;
  onRangeChange?: (range: PriceRange) => void;
  showQuickButtons?: boolean;
  quickMinValues?: number[];
  quickMaxValues?: number[];
  currency?: string;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  minValue,
  maxValue,
  onMinValueChange,
  onMaxValueChange,
  onRangeChange,
  currency = '£',
}) => {
  const sliderWidth = width - wp('12%'); // accounting for padding

  const handleValuesChange = (values: number[]) => {
    const [newMinValue, newMaxValue] = values;

    // Only update if values actually changed
    if (newMinValue !== minValue) {
      onMinValueChange(newMinValue);
    }
    if (newMaxValue !== maxValue) {
      onMaxValueChange(newMaxValue);
    }

    // Call the range change callback
    onRangeChange?.({min: newMinValue, max: newMaxValue});
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <MultiSlider
          values={[minValue, maxValue]}
          min={min}
          max={max}
          step={1}
          sliderLength={sliderWidth}
          onValuesChange={handleValuesChange}
          allowOverlap={false}
          snapped={false}
          containerStyle={styles.multiSliderContainer}
          trackStyle={styles.sliderTrack}
          selectedStyle={styles.sliderActiveTrack}
          unselectedStyle={styles.sliderInactiveTrack}
          markerStyle={styles.sliderThumb}
          pressedMarkerStyle={styles.sliderThumbActive}
          touchDimensions={{
            height: 40,
            width: 40,
            borderRadius: 20,
            slipDisplacement: 200,
          }}
        />
      </View>

      <View style={styles.priceLabels}>
        <Text style={styles.priceLabel}>
          {currency}
          {min}
        </Text>
        <View style={styles.currentPriceContainer}>
          <Text style={styles.currentPrice}>
            {currency}
            {minValue} - {currency}
            {maxValue}
          </Text>
        </View>
        <Text style={styles.priceLabel}>
          {currency}
          {max}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 10,
  },
  priceLabel: {
    fontSize: fontSize.f12,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
    width: 50,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    marginBottom: 0,
  },
  multiSliderContainer: {
    alignItems: 'center',
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
  },
  sliderActiveTrack: {
    backgroundColor: '#B687D9',
  },
  sliderInactiveTrack: {
    backgroundColor: '#E5E7EB',
  },
  sliderThumb: {
    width: 25,
    height: 25,
    backgroundColor: Colors.white,
    borderRadius: 12.5,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 5,
    borderColor: '#919191',
  },
  sliderThumbActive: {
    width: 25,
    height: 25,
    backgroundColor: Colors.white,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 10,
    borderWidth: 5,
    borderColor: '#8800FF',
  },
  currentPriceContainer: {
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'center',
  },
  currentPrice: {
    fontSize: fontSize.f12,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
});

export default PriceRangeSlider;
