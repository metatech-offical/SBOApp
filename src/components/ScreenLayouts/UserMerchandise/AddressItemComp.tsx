import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {RadioButton} from 'react-native-radio-buttons-group';
import FastImage from 'react-native-fast-image';

interface AddressItemCompProps {
  item: GetAllAddressData;
  onPress: () => void;
  isSelected?: boolean;
  editAddressOnPress?: () => void;
  isEditable?: boolean;
}
const AddressItemComp = ({
  item,
  onPress,
  isSelected = false,
  editAddressOnPress,
  isEditable = true,
}: AddressItemCompProps) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={{width: '90%'}}>
        <View style={styles.addressTypeContainer}>
          <Text style={styles.addressType}>{item.addressType}</Text>
          {isEditable && editAddressOnPress && (
            <Pressable onPress={editAddressOnPress} hitSlop={20}>
              <FastImage
                source={require('@assets/images/editAddressIcon.png')}
                style={styles.addressIcon}
              />
            </Pressable>
          )}
        </View>
        <View style={styles.addressContainer}>
          {item.fullName && (
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.fullName}>
              {item.fullName} {''}
              {item.countryCode && item.mobileNumber && (
                <Text style={styles.address}>
                  | {item.countryCode} {item.mobileNumber}
                </Text>
              )}
            </Text>
          )}
        </View>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>
            {[
              item.streetNo,
              item.buildingName,
              item.city,
              item.areaDistrict,
              item.landmark,
            ]
              .filter(Boolean)
              .join(', ')}
          </Text>
        </View>
      </View>
      <View style={{width: '8%', alignItems: 'flex-end'}}>
        <RadioButton
          id={item._id}
          color={Colors.white}
          selected={isSelected}
          borderColor={Colors.white}
          onPress={onPress}
        />
      </View>
    </Pressable>
  );
};

export default AddressItemComp;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    minHeight: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 15,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  fullName: {
    fontSize: fontSize.f16,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  address: {
    fontSize: fontSize.f14,
    color: '#CAC9CE',
    fontFamily: fonts['Poppins-Medium'],
  },
});
