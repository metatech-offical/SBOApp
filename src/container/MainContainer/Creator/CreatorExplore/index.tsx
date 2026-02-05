import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {CreatorExploreProps} from '@navigation/screens';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import SearchInput from '@components/CustomInputs/SearchInput';
import ResentSearchHistory from '@components/ScreenLayouts/Explore/ResentSearchHistory';
import TrendingSeachCard from '@components/ScreenLayouts/Explore/TrendingSeachCard';
import {fontSize, hp, wp} from '@constant/fontSize';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {navigate} from '@navigation/utils';
import {
  useGetSearchResultsQuery,
  useGetTrendingSearchResultsQuery,
} from '@rtkServices/SearchService';
import NodataFound from '@components/DataEmpty/NodataFound';
import Loader from '@components/CustomLoader/Loader';
import SugetionList from '@components/ScreenLayouts/Explore/SugetionList';
import SearchHeader from '@components/CustomHeaders/SearchHeader';

const CreatorExplore = ({navigation}: CreatorExploreProps) => {
  const {data: trendingSearchResults, isLoading} =
    useGetTrendingSearchResultsQuery();

  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: searchResults,
    isLoading: searchLoading,
    isFetching: searchFetching,
  } = useGetSearchResultsQuery({search: searchQuery});

  const handleSearchItemPress = (text: string) => {
    setSearchQuery(text);
  };

  // Clear search input when user switches away from Explore tab
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // Clear search when leaving the screen
        setSearchQuery('');
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <SearchHeader
          title={'Search for '}
          onBackPress={() => navigation.goBack()}
        />
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
          containerStyle={{backgroundColor: '#130E33', marginBottom: hp('2')}}
          onPress={() => {
            navigate('SearchResultScreen', {
              searchQuery: searchQuery,
            });
          }}
        />

        {isLoading ? (
          <Loader visible={isLoading} />
        ) : searchQuery.length > 0 ? (
          <SugetionList
            data={searchResults?.data || {streams: [], shorts: [], users: []}}
            isLoading={searchLoading || searchFetching}
          />
        ) : (
          <FlatList
            data={trendingSearchResults?.data?.streams}
            numColumns={2}
            columnWrapperStyle={{
              gap: 10,
            }}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingBottom: hp('20'),
              gap: 10,
            }}
            ListHeaderComponent={() => (
              <>
                <ResentSearchHistory
                  data={trendingSearchResults?.data?.recentSearches || []}
                  onItemPress={handleSearchItemPress}
                />
                <Text style={styles.title}>Trending Searches</Text>
              </>
            )}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TrendingSeachCard
                data={item}
                onPress={() => {
                  navigation.navigate('NormalPlayer' as any, {
                    streamId: item._id,
                  });
                }}
                customContainerStyle={{
                  marginTop: 10,
                }}
              />
            )}
            ListEmptyComponent={<NodataFound />}
          />
        )}
      </View>
    </View>
  );
};

export default CreatorExplore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    marginBottom: 70,
  },
  recentSearchesContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  title: {
    fontSize: fontSize.f20,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
    marginTop: hp('4'),
    marginLeft: wp('1'),
  },
  logo: {
    height: 33,
    width: 78,
    resizeMode: 'contain',
  },
});
