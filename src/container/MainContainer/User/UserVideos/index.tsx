import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {UserVideosProps} from '@navigation/screens';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import HomeHeader from '@components/ScreenLayouts/Home/HomeHeader';
import {fonts} from '@constant/fontfamily';
import ForYou from '@components/ScreenLayouts/CreatorVideos/ForYou';
import {TABS} from '@utils/data';
import ShortsScreen from '@components/ScreenLayouts/CreatorVideos/ShortsScreen';
import {ChevronDownSmallIcon} from '@assets/svg/HomeScreenIcon';
import CategoryModal from '@components/ScreenLayouts/CreatorVideos/CategoryModal';
import LiveVideosScreen from '@components/ScreenLayouts/CreatorVideos/LiveVideosScreen';
import Loader from '@components/CustomLoader/Loader';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const UserVideos = ({navigation}: UserVideosProps) => {
  const [selectedTab, setSelectedTab] = useState('For you');
  const [visitedTabs, setVisitedTabs] = useState({
    'For you': true,
    Shorts: false,
    Live: false,
  });
  const [isCategoriesModalVisible, setIsCategoriesModalVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const selectTab = (tab: string) => {
    setSelectedTab(tab);
    setVisitedTabs(prev => ({...prev, [tab]: true}));
  };

  const toggleCategoryModal = () => {
    setIsCategoriesModalVisible(!isCategoriesModalVisible);
  };

  // Static 2-second loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <GlowBackground />
      <HomeHeader isCreator={false} showLogo showBecomeCreator />
      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            hitSlop={20}
            onPress={() => selectTab(tab)}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonSelected,
            ]}>
            <Text
              style={[
                styles.tabLabel,
                selectedTab === tab && styles.tabLabelSelected,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.categoriesButton}
          onPress={toggleCategoryModal}
          activeOpacity={0.9}>
          <Text style={styles.categoriesLabel}>Categories</Text>
          <View
            style={
              isCategoriesModalVisible ? styles.chevronUp : undefined
            }>
            <ChevronDownSmallIcon />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <>
            {visitedTabs['For you'] ? (
              <View
                style={[
                  styles.feed,
                  selectedTab !== 'For you' && styles.hiddenFeed,
                ]}>
                <ForYou isActive={selectedTab === 'For you'} />
              </View>
            ) : null}
            {visitedTabs.Shorts ? (
              <View
                style={[
                  styles.feed,
                  selectedTab !== 'Shorts' && styles.hiddenFeed,
                ]}>
                <ShortsScreen isActive={selectedTab === 'Shorts'} />
              </View>
            ) : null}
            {visitedTabs.Live ? (
              <View
                style={[
                  styles.feed,
                  selectedTab !== 'Live' && styles.hiddenFeed,
                ]}>
                <LiveVideosScreen />
              </View>
            ) : null}
          </>
        )}
      </View>

      <CategoryModal
        visible={isCategoriesModalVisible}
        onClose={toggleCategoryModal}
        navigation={navigation}
      />
    </View>
  );
};

export default UserVideos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
    marginBottom: 70,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  tabButton: {
    height: 27,
    paddingHorizontal: 14,
    borderRadius: 13.5,
    marginRight: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabButtonSelected: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tabLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
    includeFontPadding: false,
  },
  tabLabelSelected: {
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  categoriesButton: {
    height: 27,
    marginLeft: 'auto',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoriesLabel: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  chevronUp: {
    transform: [{rotate: '180deg'}],
  },
  contentContainer: {
    flex: 1,
  },
  feed: {
    flex: 1,
  },
  hiddenFeed: {
    display: 'none',
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 50,
    backgroundColor: '#3B234A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.white,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
  },
});
