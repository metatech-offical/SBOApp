import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {UploadContentProps} from '@navigation/screens';
import {LinearGradient} from 'react-native-linear-gradient';
import {
  LiveIcon,
  VideoIcon,
  PostIcon,
  ShortsIcon,
} from '@assets/svg/UploadScreensIcon';
import {uploadTab} from '@utils/data';
import {handleVideoSelection, handleVideoSelection2} from '@utils/general';
import CustomButton from '@components/CustomButtons/CustomButton';
import {navigate} from '@navigation/utils';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const UploadContent = ({navigation}: UploadContentProps) => {
  const [activeTab, setActiveTab] = useState('Live');
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isShortsLoading, setIsShortsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleVideoUpload = async (isShorts: boolean = false) => {
    try {
      setIsVideoLoading(true);
      const result = await handleVideoSelection2(isShorts);
      if (result) {
        navigation.navigate('VideoPreview', {video: result, type: 'video'});
      }
    } catch (error) {
      console.error('Video upload error:', error);
    } finally {
      setIsVideoLoading(false);
    }
  };

  const handleShortsUpload = async (isShorts: boolean = false) => {
    try {
      setIsShortsLoading(true);
      const result = await handleVideoSelection2(isShorts);
      if (result) {
        navigation.navigate('VideoPreview', {video: result, type: 'shorts'});
      }
    } catch (error) {
      console.error('Shorts upload error:', error);
    } finally {
      setIsShortsLoading(false);
    }
  };

  const renderIcon = (iconName: string, isActive: boolean) => {
    const iconProps = {
      width: 24,
      height: 24,
      color: isActive ? Colors.white : '#999999',
    };

    switch (iconName) {
      case 'ShortsIcon':
        return <ShortsIcon {...iconProps} />;
      case 'VideoIcon':
        return <VideoIcon {...iconProps} />;
      case 'LiveIcon':
        return <LiveIcon {...iconProps} />;
      case 'PostIcon':
        return <PostIcon {...iconProps} />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Shorts':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>Create Short Video</Text>
            <Text style={styles.subText}>
              Record or upload short vertical videos
            </Text>
            <CustomButton
              text={isShortsLoading ? 'Processing...' : 'Create Shorts'}
              onPress={() => handleShortsUpload(true)}
              btnStyle={[
                styles.createButton,
                isShortsLoading && styles.disabledButton,
              ]}
              textStyle={styles.createButtonText}
              disabled={isShortsLoading}
              // icon={<ShortsIcon  fill={Colors.black} width={20} height={20} />}
            />
          </View>
        );
      case 'Video':
        return (
          <TouchableOpacity
            style={styles.contentContainer}
            onPress={() => handleVideoUpload(false)}>
            <Text style={styles.contentText}>Upload Video</Text>
            <Text style={styles.subText}>Share your longer form content</Text>
            <CustomButton
              text={isVideoLoading ? 'Processing...' : 'Upload Video'}
              onPress={() => handleVideoUpload(true)}
              btnStyle={[
                styles.createButton,
                isVideoLoading && styles.disabledButton,
              ]}
              textStyle={styles.createButtonText}
              disabled={isVideoLoading}
              icon={<VideoIcon fill={Colors.black} width={20} height={20} />}
            />
          </TouchableOpacity>
        );
      case 'Live':
        return (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.subText}>Go Live and Connect Instantly!</Text>
            <Text style={styles.subText}>
              Start a live stream to engage with your audience in real time.
            </Text>
            <CustomButton
              text="Create Live"
              onPress={() =>
                navigate('CreatLive', {
                  screen: 'CreatLive',
                })
              }
              btnStyle={styles.createButton}
              textStyle={styles.createButtonText}
              icon={<LiveIcon fill={Colors.black} width={20} height={20} />}
            />
          </View>
        );
      case 'Post':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>Create Post</Text>
            <Text style={styles.subText}>Share your longer form content</Text>
            <CustomButton
              text="Create Post"
              onPress={() => navigation.navigate('PostUploadScreen')}
              btnStyle={styles.createButton}
              textStyle={styles.createButtonText}
              icon={<PostIcon fill={Colors.black} width={20} height={20} />}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const onSubmit = (selectedTab: any) => {
    if (selectedTab === 'Live') {
      setActiveTab(selectedTab);
      navigate('CreatLive', {
        screen: 'CreatLive',
      });
    } else {
      setActiveTab(selectedTab);
      if (selectedTab === 'Shorts') {
        handleShortsUpload(true);
      } else if (selectedTab === 'Video') {
        handleVideoUpload(false);
      } else {
        navigation.navigate('PostUploadScreen');
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A0A47', '#100E12']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientBorder}>
        <View style={styles.mainContent}>{renderContent()}</View>

        {/* Bottom Navigation — above Android system back / gesture nav */}
        <View
          style={[
            styles.bottomNavigation,
            {paddingBottom: Math.max(insets.bottom, 16)},
          ]}>
          <View style={styles.tabContainer}>
            {uploadTab.map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  activeTab === tab.id && styles.activeTabButton,
                ]}
                disabled={isVideoLoading || isShortsLoading}
                onPress={() => onSubmit(tab.id)}>
                <View
                  style={[
                    styles.iconContainer,
                    activeTab === tab.id && styles.activeIconContainer,
                  ]}>
                  {renderIcon(tab.icon, activeTab === tab.id)}
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === tab.id && styles.activeTabLabel,
                  ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default UploadContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBorder: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  contentText: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: fontSize.f24,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  subText: {
    fontSize: fontSize.f14,
    color: '#CCCCCC',
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  bottomNavigation: {
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#131212',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 15,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 3,
    borderRadius: 30,
  },
  activeTabButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.19)',
  },
  iconContainer: {
    opacity: 0.5,
  },
  tabIcon: {
    fontSize: fontSize.f18,
    marginBottom: 5,
  },
  tabLabel: {
    color: '#999999',
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
  },
  activeTabLabel: {
    fontSize: fontSize.f12,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  activeIconContainer: {
    opacity: 1,
  },
  createButton: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    height: 45,
    width: 'auto',
  },
  createButtonText: {
    color: Colors.black,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  disabledButton: {
    opacity: 0.6,
  },
});
