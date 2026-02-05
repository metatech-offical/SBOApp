import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {PlusIcon} from '@assets/svg/CommonIcons';
import { Colors } from '@constant/colors';

const AddPlusButton = ({onPress}: {onPress?: () => void}) => {
  return (
    <TouchableOpacity style={styles.addButtonContainer}>
      <LinearGradient
        colors={['#8800FF', '#1AD655']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientBorder}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={onPress}
          hitSlop={20}
          activeOpacity={0.8}>
          <PlusIcon width={20} height={20} />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default AddPlusButton;

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    right: 30,
    bottom: Platform.OS === 'ios' ? 120 : 100,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#8800FF',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  gradientBorder: {
    width: 56,
    height: 56,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Platform.OS === 'ios' ? 0 : 3,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B234A',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
