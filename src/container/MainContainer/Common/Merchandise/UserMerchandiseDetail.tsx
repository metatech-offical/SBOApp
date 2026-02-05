import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import MerchandiseHeader from '@components/CustomHeaders/MerchandiseHeader';
import {UserMerchandiseDetailProps} from '@navigation/screens';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import {ItemCategoryData2, merchandiseFilterOptions} from '@utils/data';
import MerchandiseProductItem from '@components/ScreenLayouts/UserMerchandise/MerchandiseProductItem';
import ItemCategoryItem from '@components/ScreenLayouts/UserMerchandise/ItemCategoryItem';
import SearchBar from '@components/ScreenLayouts/UserMerchandise/SearchBar';
import {useGetAllProductsByCollectionQuery} from '@rtkServices/UserMerchandiesService';
import {Colors} from '@constant/colors';
import NodataFound from '@components/DataEmpty/NodataFound';
import Loader from '@components/CustomLoader/Loader';
import FilterSheet from '@components/CustomBottomSheet/FilterSheet';
import {Text} from 'react-native-gesture-handler';
import {RadioGroup} from '@components/RedioGroup';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
import PriceRangeSlider from '@components/CustomSlider/PriceRangeSlider';
import {fontSize, hp, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// Types
interface PriceRange {
  min: number | null;
  max: number | null;
}

// Constants
const INITIAL_PAGE = 1;
const ITEMS_PER_PAGE = 10;
const INITIAL_PRICE_RANGE: PriceRange = {min: 0, max: 1000};
const DEFAULT_SORT = 'price_low_to_high';

const UserMerchandiseDetail = ({
  navigation,
  route,
}: UserMerchandiseDetailProps) => {
  const {top} = useSafeAreaInsets();
  const {collectionId, name, profilePicture, collectionImage} =
    route?.params || {};

  // State
  const [page, setPage] = useState(INITIAL_PAGE);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Changed to empty string for "All"
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>('relevance');
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: null,
    max: null,
  });
  const [tempPriceRange, setTempPriceRange] =
    useState<PriceRange>(INITIAL_PRICE_RANGE);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  // API Query
  const queryParams = useMemo(
    () => ({
      collectionId: collectionId,
      page: page,
      limit: ITEMS_PER_PAGE,
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      sortBy: DEFAULT_SORT,
      search: search,
      status: 'live',
      category:
        selectedCategory === '' || selectedCategory === 'All'
          ? undefined
          : selectedCategory,
    }),
    [
      collectionId,
      page,
      priceRange.min,
      priceRange.max,
      search,
      selectedCategory,
    ],
  );

  const {data, isLoading, isFetching, refetch} =
    useGetAllProductsByCollectionQuery(queryParams as any);

  // Callbacks
  const handleRefresh = useCallback(() => {
    setPage(INITIAL_PAGE);
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    const totalItems = data?.data?.pagination?.total || 0;
    if (products.length < totalItems && !isFetching) {
      setPage(prevPage => prevPage + 1);
    }
  }, [products.length, data?.data?.pagination?.total, isFetching]);

  const handleApplyFilters = useCallback(() => {
    setPriceRange(tempPriceRange);
    setPage(INITIAL_PAGE);
    setIsBottomSheetOpen(false);
  }, [tempPriceRange]);

  const handleClearFilters = useCallback(() => {
    setPriceRange({min: null, max: null});
    setTempPriceRange(INITIAL_PRICE_RANGE);
    setSelectedValue('relevance');
    setSelectedCategory('');
    setPage(INITIAL_PAGE);
    setIsBottomSheetOpen(false);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(INITIAL_PAGE); // Reset to first page when category changes
    setProducts([]); // Clear existing products to show loading state
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

  // Effects
  useEffect(() => {
    if (data?.data?.totalProductList) {
      if (data.data.pagination?.page === 1) {
        setProducts(data.data.totalProductList);
      } else {
        setProducts(prevProducts => [
          ...prevProducts,
          ...data.data.totalProductList,
        ]);
      }
    }
  }, [data]);

  // Memoized values
  const headerImageSource = useMemo(
    () => ({
      uri: profilePicture || collectionImage,
    }),
    [profilePicture, collectionImage],
  );

  const headerTitle = useMemo(
    () => `Official Store Collection of ${name}`,
    [name],
  );

  const showLoadingFooter = useMemo(
    () => isFetching && products.length > 0,
    [isFetching, products.length],
  );

  // Enhanced category data with "All" option
  const enhancedCategoryData = useMemo(() => {
    const allCategory = {id: '', name: 'All'}; // Empty string ID for "All"
    return [allCategory, ...ItemCategoryData2];
  }, []);

  // Render functions
  const renderCategoryItem = useCallback(
    ({item}: {item: any}) => (
      <ItemCategoryItem
        item={item}
        isSelected={selectedCategory === item?.name?.toString()}
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
    () => (isLoading ? <Loader visible={isLoading} /> : <NodataFound />),
    [isLoading],
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
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
      />
      <View style={styles.contentOverlay}>
        <View style={styles.headerContainer}>
          <Image
            source={headerImageSource}
            style={styles.headerImage}
            blurRadius={5}
            resizeMode="cover"
          />
          <MerchandiseHeader
            onBackPress={() => navigation.goBack()}
            onCartPress={() => navigation.navigate('CartListScreen')}
          />
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>

        <SearchBar
          showFilterIcon={true}
          value={search}
          onChangeText={setSearch}
          onFilterPress={() => setIsBottomSheetOpen(true)}
          placeholder="Search for merch..."
        />

        <View style={{paddingHorizontal: 15}}>
          <FlatList
            data={enhancedCategoryData} // Use enhanced data with "All" option
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id?.toString() || 'all'} // Handle empty string ID
          />

          <FlatList
            data={products}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            contentContainerStyle={{paddingBottom: hp('80%'), flexGrow: 1}}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={renderProductItem}
            keyExtractor={item => item._id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.8}
            ListEmptyComponent={renderListEmptyComponent}
            ListFooterComponent={renderListFooterComponent}
            refreshControl={
              <CustomRefreshControler
                refreshing={isFetching}
                onRefresh={handleRefresh}
              />
            }
          />
        </View>
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
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
  },
  columnWrapper: {
    columnGap: 10,
    marginTop: 10,
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
  headerImage: {
    resizeMode: 'contain',
    position: 'absolute',
    width: wp('100%'),
    height: '100%',
    opacity: 0.3,
  },
  headerContainer: {
    height: hp('13%'),
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 0.4,
    borderRightWidth: 0.4,
    borderColor: Colors.grey,
  },
  headerTitle: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-SemiBold'],
    marginLeft: wp('5%'),
    color: Colors.white,
  },
  rotatedBackArrow: {
    transform: [{rotate: '90deg'}],
  },
});
