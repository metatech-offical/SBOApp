import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Pressable, Text} from 'react-native';
import {fontSize, hp, wp} from '@constant/fontSize';
import SearchInput from '@components/CustomInputs/SearchInput';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import {SearchResultScreenProps} from '@navigation/screens';
import VideoSearchList from '@components/ScreenLayouts/Explore/VideoSearchList';
import ShortsList from '@components/ScreenLayouts/Explore/ShortsList';
import {SEARCH_RESULT_DATA} from '@utils/data';
import {fonts} from '@constant/fontfamily';
import {useGetSearchResultsQuery} from '@rtkServices/SearchService';
import SearchHeader from '@components/CustomHeaders/SearchHeader';
import UserSearchList from '@components/ScreenLayouts/Explore/UserSearchList';
import {Colors} from '@constant/colors';
import {withDummySearchData} from '@utils/dummyVideos';

export default function SearchResultScreen({
  navigation,
  route,
}: SearchResultScreenProps) {
  const {searchQuery} = route?.params || {};
  const [search, setSearch] = useState(searchQuery);
  const [activeStep, setActiveStep] = useState(1);

  const {data: searchResults, refetch} = useGetSearchResultsQuery({
    search: search,
  });

  useEffect(() => {
    refetch();
  }, [search]);

  const searchData = withDummySearchData(searchResults?.data, search);

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
          value={search}
          onChangeText={setSearch}
          placeholder="Search"
          containerStyle={{backgroundColor: '#130E33', marginBottom: hp('2')}}
        />

        <View style={styles.stepContainerWrapper}>
              {SEARCH_RESULT_DATA.map(item => (
                <Pressable
                  key={item.id}
                  style={[
                    styles.stepContainer,
                    {
                      borderBottomWidth: activeStep === item.id ? 2 : 0,
                      borderBottomColor:
                        activeStep === item.id ? '#1AD655' : 'transparent',
                      width: '33.33%',
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() => setActiveStep(item.id)}>
                  <Text style={styles.stepText}>{item.title}</Text>
                </Pressable>
              ))}
            </View>
            {activeStep === 1 ? (
              <VideoSearchList data={searchData.streams} />
            ) : activeStep === 2 ? (
              <ShortsList data={searchData.shorts} />
            ) : (
              <UserSearchList data={searchData.users} />
            )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#130E33',
  },
  contentOverlay: {
    flex: 1,
    paddingHorizontal: wp('2'),
  },
  stepContainer: {
    padding: 10,
    marginBottom: 10,
  },
  stepText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
  },
  stepContainerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
