import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {CreatorHomeProps} from '@navigation/screens';
import HomeHeader from '@components/ScreenLayouts/Home/HomeHeader';
import UserStatics from '@components/ScreenLayouts/Home/UserStatics';
import CreatorOrdersSection from '@components/ScreenLayouts/Home/CreatorOrdersSection';
import {ScrollView} from 'react-native-gesture-handler';
import CreatorActionSection from '@components/ScreenLayouts/Home/CreatorActionSection';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import CreatorEventsSection from '@components/ScreenLayouts/Home/CreatorEventsSection';
import {useHomeStatisticsQuery} from '@rtkServices/HomeService';
import {fonts} from '@constant/fontfamily';
import {hp} from '@constant/fontSize';

const CreatorHome = ({navigation}: CreatorHomeProps) => {
  const {data} = useHomeStatisticsQuery();

  return (
    <View style={styles.container}>
      <GlowBackground />
      <HomeHeader isCreator />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <CreatorActionSection navigation={navigation} />
        <UserStatics data={data} isCreator />
        <CreatorEventsSection />
        <Pressable
          onPress={() => navigation.navigate('CreatorExplore')}
          style={styles.search}>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </Pressable>
        <CreatorOrdersSection navigation={navigation} />
      </ScrollView>
    </View>
  );
};

export default CreatorHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  search: {
    marginHorizontal: 16,
    marginTop: 24,
    height: 41,
    borderRadius: 9.5,
    borderWidth: 1,
    borderColor: 'rgba(238,238,239,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchPlaceholder: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts['Poppins-Regular'],
    color: '#BBBBBB',
  },
  scrollView: {
    paddingTop: 4,
    paddingBottom: hp('10'),
  },
});
