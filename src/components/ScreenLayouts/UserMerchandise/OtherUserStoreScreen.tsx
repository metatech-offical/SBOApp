import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Image,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import MerchandiseHeader from '@components/CustomHeaders/MerchandiseHeader';
import StoreListItem from '@components/ScreenLayouts/UserMerchandise/StoreListItem';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import SearchBar from '@components/ScreenLayouts/UserMerchandise/SearchBar';
import {useGetAllCollectionsOfStoreQuery} from '@rtkServices/UserMerchandiesService';
import NodataFound from '@components/DataEmpty/NodataFound';
import Loader from '@components/CustomLoader/Loader';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import {OtherUserStoreScreenProps} from '@navigation/screens';
import {fontSize, hp, wp} from '@constant/fontSize';

const {width, height} = Dimensions.get('window');
const HEADER_MAX_HEIGHT = hp('45%');
const HEADER_MIN_HEIGHT = hp('18%');
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const OtherUserStoreScreen = ({
  navigation,
  route,
}: OtherUserStoreScreenProps) => {
  const [collections, setCollections] = useState<StoreCollection[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;

  const {storeId, name, profilePicture} = route?.params || {};

  const {
    data: storesCollections,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllCollectionsOfStoreQuery({
    page: page,
    limit: 10,
    search: search,
    storeId: storeId,
  });

  // Optimized animation values with simpler interpolations for Android
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0.5, 0.4],
    extrapolate: 'clamp',
  });

  const borderRadius = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 20],
    extrapolate: 'clamp',
  });

  const borderOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.4],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const compactTitleOpacity = scrollY.interpolate({
    inputRange: [HEADER_SCROLL_DISTANCE * 0.5, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.6],
    outputRange: [0, -80],
    extrapolate: 'clamp',
  });

  const searchBarOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.4],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const backgroundBlur = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [2, 8],
    extrapolate: 'clamp',
  });

  const gradientOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.3],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });

  // Grouped border animations for better performance
  const borderBottomWidth = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 2],
    extrapolate: 'clamp',
  });

  const borderSideWidth = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.3],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (storesCollections) {
      if (storesCollections?.data?.pagination?.totalCount === 0) {
        setCollections([]);
      } else {
        if (page === 1) {
          setCollections(storesCollections.data.data);
        } else {
          setCollections([...collections, ...storesCollections.data.data]);
        }
      }
    }
  }, [storesCollections]);

  const handleLoadMore = () => {
    if (storesCollections?.data?.pagination?.hasNextPage) {
      setPage(page + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setSearch('');
    refetch();
  };

  // Simplified content container style calculation
  const getContentContainerStyle = () => {
    const minScrollableHeight = height + HEADER_SCROLL_DISTANCE + 200;

    return {
      ...styles.contentContainer,
      minHeight: minScrollableHeight,
    };
  };

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Animated.View
        style={[
          styles.searchContainer,
          {
            transform: [{translateY: searchBarTranslateY}],
            opacity: searchBarOpacity,
          },
        ]}>
        <SearchBar
          showFilterIcon={false}
          value={search}
          onChangeText={setSearch}
          placeholder="Search for collections"
          onFilterPress={() => {}}
        />
      </Animated.View>
    </View>
  );

  const renderFooterSpacer = () => {
    if (collections.length <= 2) {
      return <View style={styles.footerSpacer} />;
    }

    return isFetching && page !== 1 ? (
      <ActivityIndicator size="small" color={Colors.white} />
    ) : null;
  };

  // Android-specific scroll event throttle
  const scrollEventThrottle = __DEV__ && Platform.OS === 'android' ? 16 : 1;

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor="#1a1538"
      />

      <Animated.View style={[styles.contentOverlay, {marginTop: headerHeight}]}>
        <FlatList
          data={[...collections]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={getContentContainerStyle()}
          scrollEnabled={true}
          bounces={true}
          alwaysBounceVertical={true}
          decelerationRate="normal"
          scrollEventThrottle={scrollEventThrottle}
          // Android-specific optimizations
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={5}
          updateCellsBatchingPeriod={50}
          overScrollMode="never"
          disableVirtualization={false}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.loaderContainer}>
                <Loader visible={isLoading} />
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <NodataFound />
              </View>
            )
          }
          ListHeaderComponent={renderHeader}
          renderItem={({item}) => (
            <StoreListItem
              item={item}
              onPress={() =>
                navigation.navigate('UserMerchandiseDetail', {
                  collectionId: item?._id || '',
                  name: item?.store?.owner?.username || '',
                  profilePicture: item?.store.owner?.profilePicture || '',
                  collectionImage: item?.coverImage || '',
                })
              }
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          refreshControl={
            <CustomRefreshControler
              refreshing={isFetching}
              onRefresh={handleRefresh}
            />
          }
          ListFooterComponent={renderFooterSpacer}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {
              useNativeDriver: false,
            },
          )}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.animatedHeader,
          {
            height: headerHeight,
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            borderBottomWidth: borderBottomWidth,
            borderLeftWidth: borderSideWidth,
            borderRightWidth: borderSideWidth,
            borderColor: Colors.grey,
          },
        ]}>
        <Animated.Image
          source={{uri: profilePicture}}
          style={[styles.headerImage, {opacity: imageOpacity}]}
          blurRadius={backgroundBlur}
          resizeMode="cover"
        />

        <Animated.View
          style={[styles.gradientOverlay, {opacity: gradientOpacity}]}
        />

        <View style={styles.headerContent}>
          <MerchandiseHeader
            onBackPress={() => navigation.goBack()}
            onCartPress={() => navigation.navigate('CartListScreen')}
          />

          <Animated.View
            style={[styles.titleContainer, {opacity: titleOpacity}]}>
            <Text style={styles.headerTitle}>
              The official store{'\n'}of {name}
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.compactTitleContainer,
              {opacity: compactTitleOpacity},
            ]}>
            <Text style={styles.compactTitle}>
              The official store of {name}
            </Text>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

export default OtherUserStoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(26, 21, 56, 0.6)',
  },
  headerContent: {
    flex: 1,
    position: 'relative',
    zIndex: 2,
    paddingTop: 0,
  },
  titleContainer: {
    position: 'absolute',
    bottom: hp('2%'),
    left: wp('5%'),
    right: wp('5%'),
    top: hp('15%'),
    justifyContent: 'flex-end',
  },
  headerTitle: {
    fontSize: fontSize.f28,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
    lineHeight: fontSize.f28 * 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  compactTitleContainer: {
    position: 'absolute',
    bottom: hp('2%'),
    left: wp('5%'),
    right: wp('5%'),
    top: hp('8%'),
    justifyContent: 'flex-end',
  },
  compactTitle: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  contentOverlay: {
    flex: 1,
    zIndex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
    flexGrow: 1,
  },
  listHeader: {
    marginBottom: hp('2%'),
  },
  searchContainer: {
    marginTop: hp('2%'),
  },
  footerSpacer: {
    height: hp('60%'),
    backgroundColor: 'transparent',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: hp('50%'),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: hp('50%'),
  },
});
