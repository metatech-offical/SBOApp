import React, {useState, useEffect, memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import {RootState, useAppSelector} from '@store/index';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  useUpdatePlaylistMutation,
  useGetPlaylistByIdQuery,
} from '@rtkServices/PlayListService';
import {ArrowDown, ArrowUP} from '@assets/svg/AuthFlowIcons';
import VideoCard from './VideoCard';
import {EditIcon} from '@assets/svg/CommonIcons';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const PlayListScreen = ({
  playlist,
  onUpdateSuccess,
  refetch,
  onReportVideo,
}: {
  playlist: any;
  onUpdateSuccess?: () => void;
  refetch?: () => void;
  onReportVideo?: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const navigation = useNavigation();
  const [editPlaylistName] = useUpdatePlaylistMutation();
  const playlistId = playlist._id;
  const {user} = useAppSelector((state: RootState) => state.user);

  const {
    data: playlistData,
    refetch: refetchPlaylistData,
    isLoading,
  } = useGetPlaylistByIdQuery({
    playlistId: playlist._id ?? '',
  });

  useEffect(() => {
    if (playlistId) {
      refetchPlaylistData();
    }
  }, [playlistId]);

  useFocusEffect(
    React.useCallback(() => {
      if (playlistId) {
        refetchPlaylistData();
      }
      return () => {};
    }, [playlistId, refetchPlaylistData]),
  );

  const toggleExpand = () => {
    // if (isAnimating) return;

    // setIsAnimating(true);
    // LayoutAnimation.configureNext(
    //   LayoutAnimation.Presets.easeInEaseOut,
    //   () => setIsAnimating(false)
    // );
    setExpanded(!expanded);

    // if (!expanded && playlistId) {
    //   refetchPlaylistData();
    // }
  };

  const closeCreatePlaylistModal = () => {
    setModalVisible(false);
  };

  const updateTitle = async () => {
    if (!playlist._id || !playlistName.trim()) return;

    try {
      const res = await editPlaylistName({
        playlistId,
        title: playlistName.trim(),
        description: 'test',
      }).unwrap();

      closeCreatePlaylistModal();
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }

      if (refetch) {
        refetch();
      }
      refetchPlaylistData();

      navigation.navigate('AddToPlaylist', {
        playlistName: playlistName.trim(),
        playlistId: playlist._id,
        existingItems: finalPlayListData,
      });
    } catch (error) {
      console.error('Failed to update playlist title:', error);
      setModalVisible(false);
    }
  };

  const openCreatePlaylistModal = () => {
    setPlaylistName(playlist.title);
    setModalVisible(true);
  };

  const finalPlayListData = playlistData?.data?.items || [];

  return (
    <View style={styles.card}>
      <Pressable onPress={toggleExpand} style={styles.header}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 10}}>
          <Text style={styles.title}>{playlist.title}</Text>
          {expanded && playlistData?.data?.createdBy === user?._id && (
            <Pressable onPress={openCreatePlaylistModal}>
              <EditIcon fill={'#ffffff'} height={15} width={15} />
            </Pressable>
          )}
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.countText}>
            {finalPlayListData?.length ?? 0}{' '}
            {finalPlayListData?.length === 1 ? 'video' : 'videos'}
          </Text>
          {expanded ? (
            <ArrowUP width={20} height={20} fill={'#ffffff'} />
          ) : (
            <ArrowDown width={20} height={20} fill={'#ffffff'} />
          )}
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.content}>
          {isLoading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : Array.isArray(finalPlayListData) &&
            finalPlayListData?.length > 0 ? (
            finalPlayListData?.map((video: any, index: number) => (
              <VideoCard
                key={video?.contentId || `video-${index}`}
                video={video}
                playlistId={playlistData?.data?._id}
                refetch={refetchPlaylistData}
                onReportVideo={onReportVideo}
              />
            ))
          ) : (
            <Text style={styles.noData}>No videos in this playlist</Text>
          )}
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeCreatePlaylistModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '80%',
              backgroundColor: 'rgb(50, 50, 50)',
              padding: 20,
              borderRadius: 20,
            }}>
            <TextInput
              value={playlistName}
              onChangeText={setPlaylistName}
              placeholder="Playlist name"
              maxLength={30}
              placeholderTextColor={'#ffffff'}
              style={{
                fontSize: fontSize.f14,
                color: '#ffffff',
                marginBottom: 20,
              }}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Pressable onPress={closeCreatePlaylistModal}>
                <Text style={{color: '#ffffff', fontSize: fontSize.f12}}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable onPress={updateTitle}>
                <Text style={{color: '#2DA7FF', fontSize: fontSize.f12}}>
                  Next
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default memo(PlayListScreen);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(218, 218, 218, 0.19)',
    flex: 1,
    marginBottom: 6,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.f12,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    fontSize: fontSize.f12,
    color: '#aaa',
    marginRight: 6,
  },
  icon: {
    marginTop: 1,
  },
  placeholder: {
    fontSize: fontSize.f12,
    color: '#bbb',
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 12,
  },
  videoCard: {
    flexDirection: 'row',
    gap: 10,
  },
  thumbnail: {
    width: 120,
    height: 70,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  videoTitle: {
    fontSize: fontSize.f12,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  videoMeta: {
    fontSize: fontSize.f12,
    color: '#aaa',
    marginTop: 4,
  },
  badge: {
    marginTop: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    borderRadius: 4,
  },
  badgeText: {
    fontSize: fontSize.f8,
    color: Colors.black,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  noData: {
    color: '#888',
    fontSize: fontSize.f12,
  },
  loadingText: {
    color: '#888',
    fontSize: fontSize.f12,
    textAlign: 'center',
    padding: 10,
  },
});
