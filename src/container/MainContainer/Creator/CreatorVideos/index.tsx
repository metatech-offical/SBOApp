import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {CreatorVideosProps} from '@navigation/screens';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import HomeHeader from '@components/ScreenLayouts/Home/HomeHeader';
import {fonts} from '@constant/fontfamily';
import ForYou from '@components/ScreenLayouts/CreatorVideos/ForYou';
import {TABS} from '@utils/data';
import ShortsScreen from '@components/ScreenLayouts/CreatorVideos/ShortsScreen';
import {BottomArrowIcon, TopArrowIcon} from '@assets/svg/CommonIcons';
import CategoryModal from '@components/ScreenLayouts/CreatorVideos/CategoryModal';
import LiveVideosScreen from '@components/ScreenLayouts/CreatorVideos/LiveVideosScreen';
import Loader from '@components/CustomLoader/Loader';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const CreatorVideos = ({navigation}: CreatorVideosProps) => {
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
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        zIndex={0}
        backgroundColor={'#1a1538'}
      />
      <HomeHeader isCreator={true} showLogo={true} />
      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <Pressable
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
          </Pressable>
        ))}
        <Pressable
          style={styles.categoriesButton}
          onPress={toggleCategoryModal}>
          <Text style={styles.categoriesLabel}>Categories</Text>
          {isCategoriesModalVisible ? (
            <TopArrowIcon width={24} height={24} stroke={Colors.white} />
          ) : (
            <BottomArrowIcon width={24} height={24} stroke={Colors.white} />
          )}
        </Pressable>
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

export default CreatorVideos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1538',
  },
  scrollView: {
    flex: 1,
    marginBottom: 70,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  tabButtonSelected: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tabLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  tabLabelSelected: {
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  categoriesButton: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  categoriesLabel: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
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
  loadingText: {
    color: Colors.white,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
  },
});
