import {DUMMY_DELIVERY_ADDRESS, DUMMY_PRODUCTS} from './dummyMerchandise';
import {DUMMY_LIVE_EVENTS} from './dummyTicketing';

const profileImages = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200',
];

const CREATORS = [
  {username: 'wimhof', displayName: 'Wim Hof'},
  {username: 'novabeats', displayName: 'Nova Beats'},
  {username: 'stagelight', displayName: 'Stage Light'},
  {username: 'echoroom', displayName: 'Echo Room'},
  {username: 'pulseclub', displayName: 'Pulse Club'},
  {username: 'vinylyard', displayName: 'Vinyl Yard'},
  {username: 'rimelive', displayName: 'Rime Live'},
  {username: 'nightshift', displayName: 'Night Shift'},
];

export const isDummyHomeId = (id?: string) =>
  typeof id === 'string' && id.startsWith('dummy-');

const buildCreator = (index: number, prefix: string) => {
  const creator = CREATORS[index % CREATORS.length];
  return {
    _id: `${prefix}-${index + 1}`,
    username: creator.username,
    displayName: creator.displayName,
    verified: index % 2 === 0,
    bio: 'Live sessions, merch drops, and tour nights.',
    profilePicture: profileImages[index % profileImages.length],
    engagementScore: 80 - index,
  };
};

export const DUMMY_FAVORITE_CREATORS: FavoriteCreator[] = CREATORS.map(
  (creator, index) => ({
    _id: `dummy-fav-${index + 1}`,
    contentId: `dummy-fav-content-${index + 1}`,
    contentType: 'creator',
    creatorId: `dummy-fav-creator-${index + 1}`,
    userId: 'dummy-user',
    creator: {
      _id: `dummy-fav-creator-${index + 1}`,
      username: creator.username,
      verified: index % 2 === 0,
      displayName: creator.displayName,
      bio: 'Live sessions, merch drops, and tour nights.',
      profilePicture: profileImages[index % profileImages.length],
    },
  }),
);

export const DUMMY_SUBSCRIBED_CREATORS: SubscribedCreator[] = CREATORS.map(
  (creator, index) => ({
    _id: `dummy-sub-${index + 1}`,
    username: creator.username,
    subscriptionStart: new Date(
      Date.now() - (index + 1) * 1000 * 60 * 60 * 24 * 12,
    ).toISOString(),
    subscriptionEnd: new Date(
      Date.now() + (index + 3) * 1000 * 60 * 60 * 24 * 18,
    ).toISOString(),
    profilePicture: profileImages[index % profileImages.length],
  }),
);

export const DUMMY_SUBSCRIBERS: Subscriber[] = CREATORS.slice(0, 6).map(
  (creator, index) => ({
    _id: `dummy-subscriber-${index + 1}`,
    displayName: creator.displayName,
    username: creator.username,
    profilePicture: profileImages[(index + 2) % profileImages.length],
    subscriptionStart: new Date(
      Date.now() - (index + 2) * 1000 * 60 * 60 * 24 * 8,
    ).toISOString(),
    subscriptionEnd: new Date(
      Date.now() + (index + 4) * 1000 * 60 * 60 * 24 * 14,
    ).toISOString(),
  }),
);

export const DUMMY_SUGGESTED_ACCOUNTS: SuggestedAccount[] = CREATORS.map(
  (_, index) => buildCreator(index, 'dummy-suggested'),
);

export const DUMMY_WISHLIST_PRODUCTS: WishlistProduct[] = DUMMY_PRODUCTS.slice(
  0,
  6,
).map(product => ({
  _id: product._id,
  category: product.category,
  collectionId: product.collectionId,
  createdAt: product.createdAt,
  description: product.description,
  media: product.media,
  price: product.price,
  productName: product.productName,
  returnPolicy: product.returnPolicy,
  sku: product.sku,
  status: product.status,
  storeId: product.storeId,
  tags: product.tags,
  updatedAt: product.updatedAt,
  variants: product.variants.map(variant => ({
    size: variant.size,
    stock: variant.stock,
    sku: variant.sku,
    price: variant.price,
  })),
  __v: product.__v,
}));

const buildDummyOrder = (
  product: Product,
  index: number,
): OrderHistoryData => {
  const itemPrice = product.price;
  return {
    _id: `dummy-home-order-${index + 1}`,
    userId: 'dummy-user',
    storeId: product.storeId,
    creatorId: `dummy-fav-creator-${(index % 5) + 1}`,
    address: {
      location: {lat: 50.8225, lng: -0.1372},
      fullName: DUMMY_DELIVERY_ADDRESS.fullName,
      mobileNumber: DUMMY_DELIVERY_ADDRESS.mobileNumber,
      countryCode: DUMMY_DELIVERY_ADDRESS.countryCode,
      streetNo: DUMMY_DELIVERY_ADDRESS.streetNo,
      buildingName: '',
      city: DUMMY_DELIVERY_ADDRESS.city,
      areaDistrict: DUMMY_DELIVERY_ADDRESS.areaDistrict,
      landmark: DUMMY_DELIVERY_ADDRESS.landmark,
      addressType: DUMMY_DELIVERY_ADDRESS.addressType,
    },
    items: [
      {
        variant: {
          size: product.variants[1]?.size || 'M',
          color: product.variants[1]?.color || 'Black',
          price: itemPrice,
        },
        productId: product._id,
        productName: product.productName,
        sku: product.sku,
        media: product.media,
        quantity: 1,
        itemPrice,
        lineTotal: itemPrice,
      },
    ],
    totalAmount: itemPrice,
    status: index === 0 ? 'accepted' : 'pending',
    payment: {
      paymentId: `dummy-pay-${index + 1}`,
      provider: 'card',
      status: 'paid',
    },
    createdAt: new Date(
      Date.now() - (index + 1) * 1000 * 60 * 60 * 20,
    ).toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
    creator: {
      _id: `dummy-fav-creator-${(index % 5) + 1}`,
      username: CREATORS[index % CREATORS.length].username,
      displayName: CREATORS[index % CREATORS.length].displayName,
      profilePicture: profileImages[index % profileImages.length],
    },
    id: `dummy-home-order-${index + 1}`,
  };
};

export const DUMMY_HOME_ORDERS: OrderHistoryData[] = DUMMY_PRODUCTS.slice(
  0,
  3,
).map((product, index) => buildDummyOrder(product, index));

const formatTicketDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

export const DUMMY_HOME_TICKETS = DUMMY_LIVE_EVENTS.slice(0, 2).map(event => ({
  _id: `dummy-home-ticket-${event._id}`,
  eventName: event.eventLocation?.address || 'Live event',
  title: event.eventName,
  date: formatTicketDate(event.eventDateTime),
}));

export const getDummyOrderById = (id?: string) =>
  DUMMY_HOME_ORDERS.find(order => order._id === id);

export const DUMMY_HOME_STATS = {
  totalWatchedVideos: 24,
  totalOrders: 12,
  tickets: 5,
  totalEvents: 3,
};

export const DUMMY_MANAGE_ORDERS: (GetOrdersManagementResponse & {
  media?: string;
  productName?: string;
})[] = DUMMY_PRODUCTS.slice(0, 4).map((product, index) => ({
  orderId: `dummy-${100024 + index}`,
  orderStatus: index === 0 ? 'pending' : index === 1 ? 'accepted' : 'pending',
  user: {
    username: CREATORS[index % CREATORS.length].username,
    profilePicture: profileImages[index % profileImages.length],
  },
  orderedAt: new Date(
    Date.now() - (index + 1) * 1000 * 60 * 60 * 18,
  ).toISOString(),
  media: product.media[0],
  productName: product.productName,
}));
