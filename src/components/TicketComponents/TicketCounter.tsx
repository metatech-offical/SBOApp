import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface TicketCounterProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  maxDisabled?: boolean;
  minDisabled?: boolean;
}

const TicketCounter: React.FC<TicketCounterProps> = ({
  value,
  onChange,
  min = 0,
  max = 10,
  maxDisabled = false,
  minDisabled = false,
}) => {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrease = () => {
    if (value < max) onChange(value + 1);
  };

  const checkminDisabled = value === min || minDisabled;
  const checkmaxDisabled = value === max || maxDisabled;
  return (
    <View style={styles.container}>
      {/* - Button */}
      <TouchableOpacity
        style={[styles.button, checkminDisabled && styles.disabled]}
        onPress={!checkminDisabled ? handleDecrease : undefined}
        activeOpacity={0.7}>
        <Text style={styles.btnText}>-</Text>
      </TouchableOpacity>

      {/* Count */}
      <View style={styles.centerBox}>
        <Text style={styles.count}>{value}</Text>
        <Text style={styles.label}>ticket{value > 1 ? 's' : ''}</Text>
      </View>

      {/* + Button */}
      <TouchableOpacity
        style={[styles.button, checkmaxDisabled && styles.disabled]}
        onPress={!checkmaxDisabled ? handleIncrease : undefined}
        activeOpacity={0.7}>
        <Text style={styles.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TicketCounter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,
  },

  button: {
    width: 36,
    height: 28,
    borderRadius: 52,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabled: {
    opacity: 0.4,
  },

  btnText: {
    color: '#fff',
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '600',
  },

  centerBox: {
    alignItems: 'center',
  },

  count: {
    color: '#fff',
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-Medium'],
  },

  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSize.f10,
    marginTop: -2,
    fontFamily: fonts['Poppins-Regular'],
  },
});
