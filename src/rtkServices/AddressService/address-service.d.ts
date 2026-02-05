// Address Types
interface Location {
  lat?: number;
  lng?: number;
}

interface CreateAddressReq {
  fullName: string;
  mobileNumber: string;
  countryCode: string;
  streetNo?: string;
  location?: Location;
  buildingName: string;
  city: string;
  areaDistrict: string;
  landmark?: string;
  addressType: 'home' | 'office' | 'other';
}

interface CreateAddressRes {
  success: boolean;
  message: string;
  data: AddressData;
}

interface AddressData {
  userId: string;
  fullName: string;
  mobileNumber: string;
  countryCode: string;
  streetNo: string;
  location: {
    lat: number;
    lng: number;
  };
  buildingName: string;
  city: string;
  areaDistrict: string;
  landmark: string;
  addressType: 'home' | 'work' | string; // extendable if you have fixed types
  _id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

interface GetAllAddressesRes {
  success: boolean;
  message: string;
  data: GetAllAddressData[];
}

interface GetAllAddressData {
  _id: string;
  userId: string;
  fullName: string;
  mobileNumber: string;
  countryCode: string;
  streetNo: string;
  location: {
    lat: number;
    lng: number;
  };
  buildingName: string;
  city: string;
  areaDistrict: string;
  landmark: string;
  addressType: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  __v: number;
}

interface GetAddressByIdRes {
  success: boolean;
  message: string;
  data: GetAllAddressData;
}

interface URs {
  success: boolean;
  message: string;
  data: GetAllAddressData;
}

interface CreateOrderReq {
  addressId: string;
}
interface CheckoutRequest {
  addressId: string;
  checkoutType: 'from_cart' | 'buy_now';
  checkoutItems: CheckoutItem[];
}

interface CheckoutItem {
  productId: string;
  quantity: number;
  variant: Variant;
}

interface Variant {
  size: string;
  color: string;
  sku: string;
  price: number;
}