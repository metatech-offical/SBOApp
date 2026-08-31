import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {PlusIcon} from '@assets/svg/CommonIcons';
import {
  LiveIcon,
  VideoIcon,
  PostIcon,
  ShortsIcon,
} from '@assets/svg/UploadScreensIcon';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize, hp, wp} from '@constant/fontSize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {navigate} from '@navigation/utils';
import {handleVideoSelection2} from '@utils/general';
import {useToastMessage} from '@hooks/useToastMessage';

const CREATE_ACTIONS = [
  {id: 'live', title: 'Create Live', icon: 'LiveIcon'},
  {id: 'post', title: 'Create Post', icon: 'PostIcon'},
  {id: 'shorts', title: 'Create Shorts', icon: 'ShortsIcon'},
  {id: 'video', title: 'Upload Video', icon: 'VideoIcon'},
];

const AddPlusButton = ({onPress}: {onPress?: () => void}) => {
  const insets = useSafeAreaInsets();
  const {showError} = useToastMessage();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isPicking, setIsPicking] = useState(false);

  const tabBarHeight =
    65 +
    (Platform.OS === 'android'
      ? Math.max(insets.bottom, 16)
      : Math.max(insets.bottom, 10));

  const renderActionIcon = (iconName: string) => {
    const iconProps = {width: 22, height: 22, color: Colors.white};
    switch (iconName) {
      case 'LiveIcon':
        return <LiveIcon {...iconProps} />;
      case 'PostIcon':
        return <PostIcon {...iconProps} />;
      case 'ShortsIcon':
        return <ShortsIcon {...iconProps} />;
      case 'VideoIcon':
        return <VideoIcon {...iconProps} />;
      default:
        return null;
    }
  };

  const openMenu = () => {
    if (onPress) {
      onPress();
      return;
    }
    setMenuVisible(true);
  };

  const pickMedia = async (isShorts: boolean) => {
    try {
      setIsPicking(true);
      const result = await handleVideoSelection2(isShorts);
      setMenuVisible(false);
      if (result) {
        navigate('VideoPreview', {
          video: result,
          type: isShorts ? 'shorts' : 'video',
        });
      }
    } catch (error: any) {
      showError(error?.message || 'Unable to open media picker');
    } finally {
      setIsPicking(false);
    }
  };

  const handleAction = (id: string) => {
    if (isPicking) {
      return;
    }
    switch (id) {
      case 'live':
        setMenuVisible(false);
        navigate('CreatLive', {});
        break;
      case 'post':
        setMenuVisible(false);
        navigate('PostUploadScreen', {});
        break;
      case 'shorts':
        pickMedia(true);
        break;
      case 'video':
        pickMedia(false);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.addButtonContainer, {bottom: tabBarHeight + 64}]}
        onPress={openMenu}
        activeOpacity={0.85}>
        <LinearGradient
          colors={['#8800FF', '#1AD655']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradientBorder}>
          <View style={styles.addButton}>
            <PlusIcon width={20} height={20} />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}>
        <Pressable
          style={styles.menuBackdrop}
          onPress={() => setMenuVisible(false)}>
          <Pressable
            style={[
              styles.menuCard,
              {marginBottom: tabBarHeight + 130},
            ]}
            onPress={() => {}}>
            <Text style={styles.menuTitle}>Create</Text>
            {CREATE_ACTIONS.map(action => (
              <TouchableOpacity
                key={action.id}
                style={styles.menuItem}
                onPress={() => handleAction(action.id)}
                disabled={isPicking}
                activeOpacity={0.8}>
                <View style={styles.menuIconWrap}>
                  {renderActionIcon(action.icon)}
                </View>
                <Text style={styles.menuItemText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default AddPlusButton;

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    right: 20,
    zIndex: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#8800FF',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  gradientBorder: {
    width: 56,
    height: 56,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Platform.OS === 'ios' ? 0 : 3,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B234A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
    paddingHorizontal: wp('4'),
  },
  menuCard: {
    backgroundColor: '#1B152C',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: hp('2'),
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
  },
  menuTitle: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    columnGap: 12,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
});
