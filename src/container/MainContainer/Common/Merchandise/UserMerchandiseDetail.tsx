import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import MerchandiseHeader from '@components/CustomHeaders/MerchandiseHeader';
import {UserMerchandiseDetailProps} from '@navigation/screens';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import {merchandiseFilterOptions} from '@utils/data';
import MerchandiseProductItem from '@components/ScreenLayouts/UserMerchandise/MerchandiseProductItem';
import ItemCategoryItem from '@components/ScreenLayouts/UserMerchandise/ItemCategoryItem';
import SearchBar from '@components/ScreenLayouts/UserMerchandise/SearchBar';
import {useGetAllProductsByCollectionQuery} from '@rtkServices/UserMerchandiesService';
import {Colors} from '@constant/colors';
import TicketingNoResult from '@components/DataEmpty/TicketingNoResult';
import FilterSheet from '@components/CustomBottomSheet/FilterSheet';
import {Text} from 'react-native-gesture-handler';
import {RadioGroup} from '@components/RedioGroup';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
import PriceRangeSlider from '@components/CustomSlider/PriceRangeSlider';
import {fontSize, hp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  MERCH_PRODUCT_CATEGORIES,
  filterDummyProducts,
  isDummyMerchandiseId,
} from '@utils/dummyMerchandise';

interface PriceRange {
  min: number | null;
  max: number | null;
}

const INITIAL_PAGE = 1;
const ITEMS_PER_PAGE = 10;
const INITIAL_PRICE_RANGE: PriceRange = {min: 0, max: 1000};
const DEFAULT_SORT = 'new_arrivals';

const isAllCategory = (category?: string) =>
  !category || category === 'All' || category === 'All Items';

const UserMerchandiseDetail = ({
  navigation,
  route,
}: UserMerchandiseDetailProps) => {
  const {top} = useSafeAreaInsets();
  const {collectionId} = route?.params || {};
  const isDummyCollection = isDummyMerchandiseId(collectionId);

  const [page, setPage] = useState(INITIAL_PAGE);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(DEFAULT_SORT);
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: null,
    max: null,
  });
  const [tempPriceRange, setTempPriceRange] =
    useState<PriceRange>(INITIAL_PRICE_RANGE);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  const queryParams = useMemo(
    () => ({
      collectionId: collectionId,
      page: page,
      limit: ITEMS_PER_PAGE,
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      sortBy: selectedValue || DEFAULT_SORT,
      search: search,
      status: 'live',
      category: isAllCategory(selectedCategory) ? undefined : selectedCategory,
    }),
    [
      collectionId,
      page,
      priceRange.min,
      priceRange.max,
      search,
      selectedCategory,
      selectedValue,
    ],
  );

  const {data, isLoading, isFetching, refetch} =
    useGetAllProductsByCollectionQuery(queryParams as any, {
      skip: isDummyCollection || !collectionId,
    });

  const dummyProducts = useMemo(
    () =>
      filterDummyProducts({
        collectionId,
        search,
        category: selectedCategory,
        priceMin: priceRange.min,
        priceMax: priceRange.max,
        sortBy: selectedValue,
      }),
    [
      collectionId,
      search,
      selectedCategory,
      priceRange.min,
      priceRange.max,
      selectedValue,
    ],
  );

  const displayProducts = useMemo(() => {
    if (products.length > 0) {
      return products;
    }
    if (!isDummyCollection && isLoading) {
      return [];
    }
    return dummyProducts;
  }, [dummyProducts, isDummyCollection, isLoading, products]);

  const handleRefresh = useCallback(() => {
    setPage(INITIAL_PAGE);
    if (!isDummyCollection) {
      refetch();
    }
  }, [isDummyCollection, refetch]);

  const handleLoadMore = useCallback(() => {
    if (isDummyCollection) {
      return;
    }
    const totalItems = data?.data?.pagination?.total || 0;
    if (products.length < totalItems && !isFetching) {
      setPage(prevPage => prevPage + 1);
    }
  }, [
    data?.data?.pagination?.total,
    isDummyCollection,
    isFetching,
    products.length,
  ]);

  const handleApplyFilters = useCallback(() => {
    setPriceRange(tempPriceRange);
    setPage(INITIAL_PAGE);
    setIsBottomSheetOpen(false);
  }, [tempPriceRange]);

  const handleClearFilters = useCallback(() => {
    setPriceRange({min: null, max: null});
    setTempPriceRange(INITIAL_PRICE_RANGE);
    setSelectedValue(DEFAULT_SORT);
    setSelectedCategory('All Items');
    setPage(INITIAL_PAGE);
    setIsBottomSheetOpen(false);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(INITIAL_PAGE);
    setProducts([]);
  }, []);

  const handleProductPress = useCallback(
    (productId: string) => {
      navigation.navigate('ProductDetail', {_id: productId});
    },
    [navigation],
  );

  const handleBottomSheetClose = useCallback(() => {
    setIsBottomSheetOpen(false);
  }, []);

  const handleMinPriceChange = useCallback((value: number) => {
    setTempPriceRange(prev => ({...prev, min: value}));
  }, []);

  const handleMaxPriceChange = useCallback((value: number) => {
    setTempPriceRange(prev => ({...prev, max: value}));
  }, []);

  const handleValueChange = useCallback((value: string | number) => {
    setSelectedValue(value.toString());
  }, []);

  useEffect(() => {
    if (isDummyCollection || !data?.data?.totalProductList) {
      return;
    }
    if (data.data.pagination?.page === 1) {
      setProducts(data.data.totalProductList);
    } else {
      setProducts(prevProducts => [
        ...prevProducts,
        ...data.data.totalProductList,
      ]);
    }
  }, [data, isDummyCollection]);

  const showLoadingFooter = useMemo(
    () => !isDummyCollection && isFetching && products.length > 0,
    [isDummyCollection, isFetching, products.length],
  );

  const renderCategoryItem = useCallback(
    ({item}: {item: any}) => (
      <ItemCategoryItem
        item={item}
        isSelected={
          isAllCategory(selectedCategory)
            ? isAllCategory(item?.name)
            : selectedCategory === item?.name?.toString()
        }
        onPress={() => handleCategorySelect(item?.name?.toString())}
      />
    ),
    [selectedCategory, handleCategorySelect],
  );

  const renderProductItem = useCallback(
    ({item}: {item: Product}) => (
      <MerchandiseProductItem
        userType={'user'}
        item={item}
        onPress={() => handleProductPress(item._id)}
      />
    ),
    [handleProductPress],
  );

  const renderListEmptyComponent = useCallback(
    () =>
      isLoading && !isDummyCollection ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={Colors.white} />
        </View>
      ) : (
        <TicketingNoResult />
      ),
    [isDummyCollection, isLoading],
  );

  const renderListFooterComponent = useCallback(
    () =>
      showLoadingFooter ? (
        <ActivityIndicator size="small" color={Colors.white} />
      ) : null,
    [showLoadingFooter],
  );

  const renderBackArrow = useMemo(
    () => (
      <BackArrow
        width={20}
        height={20}
        fill={Colors.white}
        style={styles.rotatedBackArrow}
      />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <GlowBackground />
      <View style={styles.contentOverlay}>
        <MerchandiseHeader
          onBackPress={() => navigation.goBack()}
          onCartPress={() => navigation.navigate('CartListScreen')}
        />

        <SearchBar
          showFilterIcon={true}
          value={search}
          onChangeText={setSearch}
          onFilterPress={() => setIsBottomSheetOpen(true)}
          placeholder="Search for merch..."
        />

        <FlatList
          data={MERCH_PRODUCT_CATEGORIES}
          horizontal
          style={styles.categoryList}
          contentContainerStyle={styles.categoryContent}
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id?.toString() || item.name}
        />

        <FlatList
          data={displayProducts}
          style={styles.productGrid}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          contentContainerStyle={styles.productList}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderProductItem}
          keyExtractor={item => item._id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          ListEmptyComponent={renderListEmptyComponent}
          ListFooterComponent={renderListFooterComponent}
          refreshControl={
            <CustomRefreshControler
              refreshing={!isDummyCollection && isFetching && page === 1}
              onRefresh={handleRefresh}
            />
          }
        />
      </View>

      {isBottomSheetOpen && (
        <FilterSheet
          index={0}
          cuttomSnapPoints={['65%']}
          onClose={handleBottomSheetClose}
          renderView={() => (
            <View style={{paddingTop: 10, marginTop: top}}>
              <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="Search for merch..."
                icon={renderBackArrow}
                onFilterPress={handleBottomSheetClose}
              />

              <View style={{paddingHorizontal: 18}}>
                <Text style={styles.sectionTitle}>Sort by</Text>
                <RadioGroup
                  options={merchandiseFilterOptions}
                  selectedValue={selectedValue}
                  onValueChange={handleValueChange}
                  direction="column"
                />

                <Text style={styles.sectionTitle}>Price Range</Text>
                <PriceRangeSlider
                  min={0}
                  max={1000}
                  minValue={tempPriceRange.min || 0}
                  maxValue={tempPriceRange.max || 0}
                  onMinValueChange={handleMinPriceChange}
                  onMaxValueChange={handleMaxPriceChange}
                />

                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={handleClearFilters}>
                    <Text style={styles.filterButtonText}>Clear</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.applyFilterButton}
                    onPress={handleApplyFilters}>
                    <Text style={styles.applyButtonText}>Apply Filter</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default UserMerchandiseDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  contentOverlay: {
    flex: 1,
    zIndex: 2,
  },
  categoryList: {
    flexGrow: 0,
    marginBottom: 16,
  },
  categoryContent: {
    paddingHorizontal: 16,
  },
  productList: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    flexGrow: 1,
  },
  productGrid: {
    flex: 1,
  },
  columnWrapper: {
    columnGap: 17,
  },
  loaderContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: hp('1%'),
    marginTop: hp('3%'),
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('3%'),
    paddingTop: hp('2%'),
    borderTopWidth: 1,
    borderColor: '#FFFFFF0A',
  },
  clearButton: {
    width: '30%',
    height: hp('6%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEF24',
  },
  filterButtonText: {
    color: Colors.white,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
  },
  applyFilterButton: {
    backgroundColor: Colors.white,
    width: '65%',
    height: hp('6%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: Colors.black,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  rotatedBackArrow: {
    transform: [{rotate: '90deg'}],
  },
});
