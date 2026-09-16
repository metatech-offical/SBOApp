const merchImages = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200',
];

const profileImages = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
];

const productImages = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a99b?w=800',
  'https://images.unsplash.com/photo-1588850561407-73954769d5a3?w=800',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
];

export const isDummyMerchandiseId = (id?: string) =>
  typeof id === 'string' && id.startsWith('dummy-merch');

export const isDummyProductId = (id?: string) =>
  typeof id === 'string' && id.startsWith('dummy-product');

export const MERCH_PRODUCT_CATEGORIES = [
  {id: '', name: 'All Items'},
  {id: 't-shirts', name: 'T-Shirts'},
  {id: 'hoodies', name: 'Hoodies'},
  {id: 'caps', name: 'Caps'},
  {id: 'accessories', name: 'Accessories'},
];

export const DUMMY_COLLECTIONS: any[] = [
  {
    _id: 'dummy-merch-1',
    name: 'Tour Collection',
    description: 'Official merch from the latest tour.',
    tags: ['Apparel', 'Tour'],
    coverImage: merchImages[0],
    store: {
      name: 'Nova Beats',
      owner: {profilePicture: profileImages[0]},
    },
  },
  {
    _id: 'dummy-merch-2',
    name: 'Streetwear Drop',
    description: 'Limited hoodies and tees.',
    tags: ['Streetwear', 'Limited'],
    coverImage: merchImages[1],
    store: {
      name: 'Stage Light',
      owner: {profilePicture: profileImages[1]},
    },
  },
  {
    _id: 'dummy-merch-3',
    name: 'Studio Capsule',
    description: 'Hats, tees, and accessories.',
    tags: ['Accessories', 'Caps'],
    coverImage: merchImages[2],
    store: {
      name: 'Echo Room',
      owner: {profilePicture: profileImages[2]},
    },
  },
  {
    _id: 'dummy-merch-4',
    name: 'Night Session',
    description: 'Dark-room exclusive merch.',
    tags: ['Limited', 'Night'],
    coverImage: merchImages[3],
    store: {
      name: 'Pulse Club',
      owner: {profilePicture: profileImages[3]},
    },
  },
];

export const DUMMY_DELIVERY_ADDRESS = {
  fullName: 'Martix Garret',
  countryCode: '+44',
  mobileNumber: '321 654 00',
  streetNo: '45 Maple Street',
  city: 'Brighton',
  areaDistrict: 'BN1 4AA',
  landmark: 'United Kingdom',
  addressType: 'Delivery Address',
};

export const DUMMY_PRODUCT_DETAILS = [
  'Contrast tipping',
  'Slim Fit',
  'Dry clean',
  'Polyester material',
  'Machine wash',
];

const PRODUCT_TEMPLATES = [
  {
    slug: 'breathe-tee',
    productName: 'Masters Of Our Own Minds',
    category: 'T-Shirts',
    brand: 'Wim Hof',
    price: 19,
    image: productImages[0],
    description: 'Soft cotton tee from the latest tour drop.',
  },
  {
    slug: 'natural-state-tee',
    productName: 'Natural State Tee',
    category: 'T-Shirts',
    price: 18,
    image: productImages[1],
    description: 'Graphic tee with a forest-inspired print.',
  },
  {
    slug: 'pulse-hoodie',
    productName: 'Pulse Club Hoodie',
    category: 'Hoodies',
    price: 48,
    image: productImages[2],
    description: 'Heavyweight hoodie for late-night sessions.',
  },
  {
    slug: 'stage-cap',
    productName: 'Stage Light Cap',
    category: 'Caps',
    price: 16,
    image: productImages[4],
    description: 'Embroidered cap from the streetwear drop.',
  },
  {
    slug: 'echo-tee',
    productName: 'Echo Room Tee',
    category: 'T-Shirts',
    price: 22,
    image: productImages[3],
    description: 'Studio capsule tee with a faded wash.',
  },
  {
    slug: 'tour-tote',
    productName: 'Tour Tote Bag',
    category: 'Accessories',
    price: 12,
    image: productImages[5],
    description: 'Canvas tote with the official tour mark.',
  },
  {
    slug: 'love-power-tee',
    productName: 'All The Love Tee',
    category: 'T-Shirts',
    price: 20,
    image: productImages[1],
    description: 'Limited print tee from the night session drop.',
  },
  {
    slug: 'studio-hoodie',
    productName: 'Studio Capsule Hoodie',
    category: 'Hoodies',
    price: 52,
    image: productImages[2],
    description: 'Oversized hoodie from the studio capsule.',
  },
];

const buildDummyProduct = (
  collection: (typeof DUMMY_COLLECTIONS)[number],
  template: (typeof PRODUCT_TEMPLATES)[number],
  index: number,
): Product =>
  ({
    _id: `dummy-product-${collection._id}-${template.slug}`,
    productName: template.productName,
    description: template.description,
    price: template.price,
    media: [
      template.image,
      productImages[(index + 1) % productImages.length],
    ],
    storeId: collection._id,
    collectionId: collection._id,
    sku: `SBO-${index + 1}`,
    tags: [template.category],
    category: template.category,
    status: 'live',
    isAddedToWishlist: index === 2,
    returnPolicy:
      'Easy 14 days returns. Return policies may vary based on product.',
    productDetails: DUMMY_PRODUCT_DETAILS,
    storeName: (template as {brand?: string}).brand || collection.store.name,
    storeLogo: collection.store.owner.profilePicture,
    variants: [
      {
        color: 'Black',
        price: template.price,
        size: 'XS',
        sku: `SBO-${index + 1}-XS`,
        stock: 0,
      },
      {
        color: 'Black',
        price: template.price,
        size: 'S',
        sku: `SBO-${index + 1}-S`,
        stock: 12,
      },
      {
        color: 'Black',
        price: template.price,
        size: 'M',
        sku: `SBO-${index + 1}-M`,
        stock: 18,
      },
      {
        color: 'Black',
        price: template.price,
        size: 'L',
        sku: `SBO-${index + 1}-L`,
        stock: 9,
      },
    ],
    createdAt: new Date(
      Date.now() - (index + 1) * 1000 * 60 * 60 * 18,
    ).toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
    hasVariants: true,
    stock: 39,
  } as Product);

export const DUMMY_PRODUCTS: Product[] = DUMMY_COLLECTIONS.flatMap(collection =>
  PRODUCT_TEMPLATES.map((template, index) =>
    buildDummyProduct(collection, template, index),
  ),
);

export const filterDummyMerchandise = (search = '') => {
  const query = search.trim().toLowerCase();
  if (!query) {
    return DUMMY_COLLECTIONS;
  }
  return DUMMY_COLLECTIONS.filter(item => {
    const name = item?.name?.toLowerCase?.() || '';
    const storeName = item?.store?.name?.toLowerCase?.() || '';
    return name.includes(query) || storeName.includes(query);
  });
};

const getProductPrice = (item: Product) => {
  if (item?.variants?.length) {
    return Math.min(...item.variants.map(variant => variant.price));
  }
  return item?.price ?? 0;
};

export const getDummyProductById = (id?: string) =>
  DUMMY_PRODUCTS.find(item => item._id === id);

export const DUMMY_CART_ITEMS: CartItem[] = DUMMY_PRODUCTS.slice(0, 3).map(
  product => {
    const collection = DUMMY_COLLECTIONS.find(
      item => item._id === product.collectionId,
    );
    return {
      productId: {
        _id: product._id,
        productName: product.productName,
        media: product.media,
        storeId: {
          _id: product.storeId,
          logo: collection?.store?.owner?.profilePicture || profileImages[0],
          name: collection?.store?.name || 'SBO Store',
        },
        status: product.status,
      },
      storeId: product.storeId,
      variant: {
        size: product.variants[1]?.size || 'M',
        color: product.variants[1]?.color || 'Black',
        sku: product.variants[1]?.sku || product.sku,
        price: product.price,
      },
      quantity: 1,
      addedAt: new Date().toISOString(),
    };
  },
);

export const filterDummyProducts = ({
  collectionId,
  search = '',
  category,
  priceMin,
  priceMax,
  sortBy,
}: {
  collectionId?: string;
  search?: string;
  category?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  sortBy?: string;
}) => {
  const query = search.trim().toLowerCase();
  const normalizedCategory = category?.toLowerCase?.() || '';
  const isAllCategory =
    !normalizedCategory ||
    normalizedCategory === 'all' ||
    normalizedCategory === 'all items';

  const scopedCollectionId = isDummyMerchandiseId(collectionId)
    ? collectionId
    : DUMMY_COLLECTIONS[0]._id;

  const filtered = DUMMY_PRODUCTS.filter(item => {
    if (item.collectionId !== scopedCollectionId) {
      return false;
    }
    if (query) {
      const name = item.productName?.toLowerCase?.() || '';
      const itemCategory = item.category?.toLowerCase?.() || '';
      if (!name.includes(query) && !itemCategory.includes(query)) {
        return false;
      }
    }
    if (!isAllCategory && item.category?.toLowerCase?.() !== normalizedCategory) {
      return false;
    }
    const price = getProductPrice(item);
    if (typeof priceMin === 'number' && price < priceMin) {
      return false;
    }
    if (typeof priceMax === 'number' && priceMax > 0 && price > priceMax) {
      return false;
    }
    return true;
  });

  const sorted = [...filtered];
  if (sortBy === 'price_low_to_high') {
    sorted.sort((a, b) => getProductPrice(a) - getProductPrice(b));
  } else if (sortBy === 'price_high_to_low') {
    sorted.sort((a, b) => getProductPrice(b) - getProductPrice(a));
  } else {
    sorted.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  return sorted;
};
