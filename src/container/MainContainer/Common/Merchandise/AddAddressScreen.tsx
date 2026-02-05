import {View, StyleSheet, FlatList, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AddAddressScreenProps} from '@navigation/screens';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import {Controller, useForm} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import CustomButton from '@components/CustomButtons/CustomButton';
import {Colors} from '@constant/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {AddressTypeData} from '@utils/data';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import useAddress from '@hooks/useAddress';
import {useGetAddressByIdQuery} from '@rtkServices/AddressService';
import Loader from '@components/CustomLoader/Loader';
import FastImage from 'react-native-fast-image';
import MobileNumInput from '@components/CustomInputs/MobileNumInput';

const AddAddressScreen = ({navigation, route}: AddAddressScreenProps) => {
  const {addressId} = route?.params || {};
  const {
    handleCreateAddress,
    isCreatingAddress,
    handleUpdateAddress,
    isUpdatingAddress,
  } = useAddress();

  const {data: addressData, isLoading} = useGetAddressByIdQuery(
    addressId || '',
    {
      skip: !addressId,
    },
  );

  const {selectAddress} = useAddress();
  const [selectedAddressType, setSelectedAddressType] = useState('home');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('91');

  const {control, handleSubmit, setValue} = useForm<any>({
    defaultValues: {
      fullName: '',
      mobile: '',
      streetNo: '',
      location: {
        lat: 0,
        lng: 0,
      },
      buildingName: '',
      city: '',
      areaDistrict: '',
      landmark: '',
      addressType: 'home',
    },
  });

  useEffect(() => {
    if (addressData?.data) {
      console.log('addressData', addressData);
      setValue('fullName', addressData?.data?.fullName);
      setValue('mobile', addressData?.data?.mobileNumber);
      setSelectedCountryCode(addressData?.data?.countryCode || '91');
      setFormattedPhoneNumber(
        `${addressData?.data?.countryCode}${addressData?.data?.mobileNumber}`,
      );
      setValue('streetNo', addressData?.data?.streetNo);
      setValue('buildingName', addressData?.data?.buildingName);
      setValue('city', addressData?.data?.city);
      setValue('areaDistrict', addressData?.data?.areaDistrict);
      setValue('landmark', addressData?.data?.landmark);
      setValue('location', {
        lat: addressData?.data?.location?.lat || 0,
        lng: addressData?.data?.location?.lng || 0,
      });
      setSelectedAddressType(
        addressData?.data?.addressType as 'home' | 'office' | 'other',
      );
    }
  }, [addressData?.data]);

  const handleAddressTypeSelect = (addressType: string) => {
    setSelectedAddressType(addressType);
    setValue('addressType', addressType as 'home' | 'office' | 'other');
  };

  const handleSaveAddress = async (data: any) => {
    // Extract mobile number without country code
    const mobileNumber = data.mobile;
    const countryCode = selectedCountryCode;

    const payload = {
      fullName: data.fullName,
      mobileNumber: mobileNumber,
      countryCode: countryCode,
      streetNo: data.streetNo,
      buildingName: data.buildingName,
      city: data.city,
      areaDistrict: data.areaDistrict,
      landmark: data.landmark,
      addressType: data.addressType,
      location: {
        lat: data?.location?.lat || 0,
        lng: data?.location?.lng || 0,
      },
    };
    console.log('payload', payload);
    const result = await handleCreateAddress(payload);
    console.log('result', result);
    if (result?.success) {
      selectAddress(result?.data);
      navigation.goBack();
    }
  };

  const handleUpdateMerchandiseAddress = async (data: any) => {
    // Extract mobile number without country code
    const mobileNumber = data.mobile;
    const countryCode = selectedCountryCode;

    const payload = {
      fullName: data.fullName,
      mobileNumber: mobileNumber,
      countryCode: countryCode,
      streetNo: data.streetNo,
      buildingName: data.buildingName,
      city: data.city,
      areaDistrict: data.areaDistrict,
      landmark: data.landmark,
      addressType: data.addressType,
      location: {
        lat: data?.location?.lat || 0,
        lng: data?.location?.lng || 0,
      },
    };

    const result = await handleUpdateAddress(addressId || '', payload);
    if (result?.success) {
      selectAddress(result?.data);
      navigation.goBack();
    }
  };


  const renderAddressTypeItem = ({item}: {item: any}) => {
    const isSelected =
      selectedAddressType.toLowerCase() === item.addressType.toLowerCase();

    return (
      <TouchableOpacity
        style={[
          styles.addressTypeContainer,
          isSelected && styles.selectedAddressTypeContainer,
        ]}
        onPress={() => handleAddressTypeSelect(item.addressType.toLowerCase())}>
        <FastImage
          source={item.image}
          style={[
            styles.addressTypeImage,
            isSelected && styles.selectedAddressTypeImage,
          ]}
        />
        <Text
          style={[
            styles.addressTypeText,
            isSelected && styles.selectedAddressTypeText,
          ]}>
          {item.addressType}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
      />
      <View style={styles.contentOverlay}>
        <StackHeader
          title="Add Address"
          onBackPress={() => navigation.goBack()}
        />
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.addressContainer}>
            <Controller
              control={control}
              rules={{required: 'Full Name field is required'}}
              name={'fullName'}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  value={value}
                  label="Full Name"
                  placeholder="Name"
                  onChangeText={onChange}
                  error={error?.message}
                  autoCapitalize="none"
                />
              )}
            />
            <Controller
              control={control}
              name="mobile"
              rules={{
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit mobile number',
                },
                required: 'Mobile number is required',
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => {
                return (
                  <MobileNumInput
                    label="Mobile Number"
                    value={value}
                    isRequired
                    onChangeText={(text: string) => {
                      const cleanText = text.replace(/\D/g, '').slice(0, 10);
                      onChange(cleanText);
                    }}
                    onChangeCountry={(country: any) => {
                      setSelectedCountryCode(
                        country?.callingCode?.[0] || '91',
                      );
                    }}
                    onChangeFormattedText={setFormattedPhoneNumber}
                    error={error?.message}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    defaultCountryCode={selectedCountryCode}
                  />
                );
              }}
            />
            <Controller
              control={control}
              rules={{required: 'Building Name field is required'}}
              name={'buildingName'}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  value={value}
                  label="Building Name"
                  placeholder="Building Name"
                  onChangeText={onChange}
                  error={error?.message}
                  autoCapitalize="none"
                />
              )}
            />
            <Controller
              control={control}
              rules={{required: 'Street field is required'}}
              name={'streetNo'}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  value={value}
                  label="Street No"
                  placeholder="Street No"
                  onChangeText={onChange}
                  error={error?.message}
                  autoCapitalize="none"
                />
              )}
            />
            <Controller
              control={control}
              rules={{required: 'City field is required'}}
              name={'city'}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  value={value}
                  label="City"
                  placeholder="City"
                  onChangeText={onChange}
                  error={error?.message}
                  autoCapitalize="none"
                />
              )}
            />
            <Controller
              control={control}
              rules={{required: 'Area/District field is required'}}
              name={'areaDistrict'}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  value={value}
                  label="Area/District"
                  placeholder="Area/District"
                  onChangeText={onChange}
                  error={error?.message}
                  autoCapitalize="none"
                />
              )}
            />
            <Controller
              control={control}
              name={'landmark'}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <TextInputWithLabels
                  value={value}
                  label="Landmark"
                  placeholder="Landmark (Optional)"
                  onChangeText={onChange}
                  error={error?.message}
                  autoCapitalize="none"
                />
              )}
            />

            {/* Save as Section */}
            <View style={styles.saveAsSection}>
              <Text style={styles.saveAsLabel}>Save as *</Text>
              <FlatList
                data={AddressTypeData}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderAddressTypeItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.addressTypeList}
              />
            </View>

            <CustomButton
              text={addressId ? 'Update' : 'Save'}
              onPress={
                addressId
                  ? handleSubmit(handleUpdateMerchandiseAddress)
                  : handleSubmit(handleSaveAddress)
              }
              textStyle={{color: Colors.black}}
              btnStyle={styles.saveBtn}
              isLoading={isCreatingAddress || isUpdatingAddress}
            />
          </KeyboardAwareScrollView>
        )}
      </View>
    </View>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
  },
  addressContainer: {
    paddingHorizontal: 15,
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: Colors.white,
  },
  saveAsSection: {
    marginTop: 20,
  },
  saveAsLabel: {
    color: Colors.white,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    marginBottom: 15,
    opacity: 0.8,
  },
  addressTypeList: {
    paddingVertical: 5,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minWidth: 100,
    height: 40,
    borderRadius: 20,
    borderColor: Colors.white,
    marginRight: 12,
    paddingHorizontal: 15,
    columnGap: 8,
    backgroundColor: 'transparent',
  },
  selectedAddressTypeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  addressTypeText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    opacity: 0.8,
  },
  selectedAddressTypeText: {
    opacity: 1,
  },
  addressTypeImage: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    opacity: 0.8,
  },
  selectedAddressTypeImage: {
    opacity: 1,
  },
});
