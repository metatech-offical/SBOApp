import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import CustomButton from '@components/CustomButtons/CustomButton';
import StackHeader from '@components/CustomHeaders/StackHeader';
import Loader from '@components/CustomLoader/Loader';
import NodataFound from '@components/DataEmpty/NodataFound';
import AddressItemComp from '@components/ScreenLayouts/UserMerchandise/AddressItemComp';
import {useGetAddressesQuery} from '@rtkServices/AddressService';
import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
import useAddress from '@hooks/useAddress';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {GetAllAddressProps} from '@navigation/screens';
import {useToastMessage} from '@hooks/useToastMessage';

const GetAllAddress = ({navigation}: GetAllAddressProps) => {
  const {showError} = useToastMessage();
  const {data: addressesData, isLoading} = useGetAddressesQuery();
  const {selectedAddress, selectAddress} = useAddress();

  const handleAddressSelect = (address: GetAllAddressData) => {
    selectAddress(address);
  };

  const handleSave = () => {
    if (selectedAddress) {
      navigation.goBack();
    } else {
      showError('Please select an address');
    }
  };

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
      />
      <View style={styles.contentOverlay}>
        <StackHeader
          title={'Addresses'}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.contentContainer}>
          {isLoading ? (
            <Loader visible={isLoading} />
          ) : (
            <FlatList
              data={addressesData?.data || []}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.addressList}
              renderItem={({item}) => (
                <AddressItemComp
                  item={item}
                  onPress={() => handleAddressSelect(item)}
                  isSelected={selectedAddress?._id === item?._id}
                />
              )}
              ListEmptyComponent={<NodataFound />}
            />
          )}

          <TouchableOpacity
            style={styles.addAddressButton}
            onPress={() =>
              navigation.navigate('AddAddressScreen', {
                addressId: '',
              })
            }>
            <Text style={styles.addAddressText}>+ Add new address</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomActions}>
          <CustomButton
            text="Back"
            onPress={() => navigation.goBack()}
            btnStyle={{width: '28%'}}
          />
          <CustomButton
            text="Save"
            onPress={handleSave}
            btnStyle={{width: '68%', backgroundColor: Colors.white}}
            textStyle={{color: Colors.black}}
          />
        </View>
      </View>
    </View>
  );
};

export default GetAllAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  addressList: {
    paddingBottom: 20,
  },
  addAddressButton: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'transparent',
    width: '92%',
    marginLeft: 15,
  },
  addAddressText: {
    color: Colors.white,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 12,
  },
});
