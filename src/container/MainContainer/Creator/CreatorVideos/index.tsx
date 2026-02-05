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
import AddPlusButton from '@components/VideosComponent/AddPlusButton';
import Loader from '@components/CustomLoader/Loader';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const CreatorVideos = ({navigation}: CreatorVideosProps) => {
  const [selectedTab, setSelectedTab] = useState('For you');
  const [isCategoriesModalVisible, setIsCategoriesModalVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const renderContent = () => {
    switch (selectedTab) {
      case 'For you':
        return <ForYou />;
      case 'Shorts':
        return <ShortsScreen />;
      case 'Live':
        return <LiveVideosScreen />;
      default:
        return null;
    }
  };

  const toggleCategoryModal = () => {
    setIsCategoriesModalVisible(!isCategoriesModalVisible);
  };

  const goToUploadContent = () => {
    navigation.navigate('UploadContent' as any);
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
            onPress={() => setSelectedTab(tab)}
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
      {isLoading ? <Loader visible={isLoading} /> : renderContent()}

      {/* Add Button */}
      <AddPlusButton onPress={goToUploadContent} />
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
