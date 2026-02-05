import {View, Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';

const AddressDetail = ({
  selectedAddress,
  addressOnPress,
  editAddressOnPress,
  style,
  isEditable = true,
}: {
  selectedAddress: any;
  addressOnPress: () => void;
  editAddressOnPress: () => void;
  style?: any;
  isEditable?: boolean;
}) => {
  return (
    <Pressable onPress={addressOnPress} style={[styles.addContainer, style]}>
      <View style={styles.addressTypeContainer}>
        <Text style={styles.addressType}>{selectedAddress?.addressType}</Text>
        {isEditable && (
          <Pressable onPress={editAddressOnPress} hitSlop={20}>
            <FastImage
              source={require('@assets/images/editAddressIcon.png')}
              style={styles.addressIcon}
            />
          </Pressable>
        )}
      </View>
      <View style={styles.addressContainer1}>
        {selectedAddress?.fullName && (
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.fullName]}>
            {selectedAddress?.fullName} {''}
            {selectedAddress?.countryCode && selectedAddress?.mobileNumber && (
              <Text style={styles.address}>
                | {selectedAddress?.countryCode} {selectedAddress?.mobileNumber}
              </Text>
            )}
          </Text>
        )}
      </View>
      <View style={styles.addressContainer1}>
        <Text style={styles.address}>
          {[
            selectedAddress?.streetNo,
            selectedAddress?.buildingName,
            selectedAddress?.city,
            selectedAddress?.areaDistrict,
            selectedAddress?.landmark,
          ]
            .filter(Boolean)
            .join(', ')}
        </Text>
      </View>
    </Pressable>
  );
};

export default AddressDetail;

const styles = StyleSheet.create({
  addContainer: {
    padding: 15,
    minHeight: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 12,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    marginTop: 20,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressType: {
    fontSize: fontSize.f14,
    color: '#CAC9CE',
    fontFamily: fonts['Poppins-Medium'],
  },
  addressIcon: {
    width: 20,
    height: 20,
  },
  addressContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  address: {
    fontSize: fontSize.f14,
    color: '#CAC9CE',
    fontFamily: fonts['Poppins-Medium'],
  },
  fullName: {
    fontSize: fontSize.f16,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
});
