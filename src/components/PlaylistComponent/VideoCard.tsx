import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {RootState, useAppSelector} from '@store/index';
import {fonts} from '@constant/fontfamily';
import {formatDate, formatViews} from '@utils/general';
import {useRemoveItemsFromPlaylistMutation} from '@rtkServices/PlayListService';
import {OptionIcon} from '@assets/svg/ShortsIcon';
import {navigate} from '@navigation/utils';
import FastImage from 'react-native-fast-image';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const VideoCard = ({
  video,
  playlistId,
  refetch,
  onReportVideo,
}: VideoCardProps1) => {
  const {contentId, contentType, content} = video;

  const {
    _id,
    description,
    videoUrl,
    thumbnailUrl,
    duration,
    creatorId,
    category,
    tags,
    likesCount,
    commentsCount,
    viewsCount,
    sharesCount,
    createdAt,
    updatedAt,
  } = content;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({top: 0, right: 0});
  const optionButtonRef = useRef(null);
  const {user} = useAppSelector((state: RootState) => state.user);
  const [removeFromPlaylist] = useRemoveItemsFromPlaylistMutation();

  const handleRemoveFromPlaylist = async () => {
    try {
      const res = await removeFromPlaylist({
        playlistId: playlistId,
        contentId: contentId,
        contentType: contentType,
      }).unwrap();
      setModalVisible(false);
      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.error('Failed to remove from playlist:', error);
    }
  };

  const handleOpenOptions = () => {
    if (optionButtonRef.current) {
      optionButtonRef.current.measure(
        (x: any, y: any, width: any, height: any, pageX: any, pageY: any) => {
          setModalPosition({
            top: pageY + height + 5,
            right: width + 10,
          });
          setModalVisible(true);
        },
      );
    }
  };

  const handleReport = () => {
    setModalVisible(false);
    onReportVideo?.({
      id: contentId,
      title: description,
      type: contentType,
    });
  };

  if (contentType === 'shorts') {
    return (
      <>
        <TouchableOpacity
          onPress={() => navigate('ShortsFeed', {shortsId: contentId})}
          style={styles.shortContainer}>
          <View style={styles.shortThumbnailContainer}>
            <ImageBackground
              source={{uri: thumbnailUrl}}
              style={styles.shortBackground}
              blurRadius={15}>
              <View style={styles.shortThumbnailWrapper}>
                <FastImage
                  source={{uri: thumbnailUrl}}
                  style={styles.shortThumbnail}
                />
              </View>
            </ImageBackground>
          </View>

          <View style={styles.shortInfo}>
            <Text style={styles.title} numberOfLines={2}>
              {description}
            </Text>
            <Text style={styles.meta}>{formatDate(createdAt)}</Text>
            {contentType === 'shorts' && (
              // <VideoStreamIcon height={24} width={24} stroke={colors.text} />
              <></>
            )}
          </View>

          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {Math.floor(duration / 1000)}s
            </Text>
          </View>
          <TouchableOpacity
            style={styles.OptionContainer}
            ref={optionButtonRef}
            onPress={handleOpenOptions}
            hitSlop={20}>
            <OptionIcon height={15} width={15} fill={'#ffffff'} />
          </TouchableOpacity>
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}>
            <View
              style={[
                styles.modalContent,
                {
                  position: 'absolute',
                  top: modalPosition.top,
                  right: modalPosition.right,
                },
              ]}>
              {user && user._id !== creatorId && (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleReport}>
                  <Text style={styles.modalOptionText}>Report</Text>
                </TouchableOpacity>
              )}

              {user && user._id === creatorId && (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleRemoveFromPlaylist}>
                  <Text style={styles.modalOptionText}>
                    Remove from playlist
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigate('NormalPlayer' as never, {
          streamId: contentId,
        });
      }}>
      <FastImage source={{uri: thumbnailUrl}} style={styles.thumbnail} />
      <View style={styles.infoContainer}>
        <Text style={[styles.title, {width: '85%'}]} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.meta}>
          {formatViews(viewsCount)} • {formatDate(createdAt)}
        </Text>
        {contentType === 'VR' && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>VR</Text>
          </View>
        )}
        {contentType === 'video' && (
          //   <VideoStreamIcon height={24} width={24} stroke={colors.text} />
          <></>
        )}
      </View>
      <View style={styles.videoLengthContainer}>
        <Text style={styles.videoLengthText}>{duration}s</Text>
      </View>
      <TouchableOpacity
        style={styles.OptionContainer}
        ref={optionButtonRef}
        onPress={handleOpenOptions}>
        <OptionIcon height={15} width={15} fill={'#ffffff'} />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}>
          <View
            style={[
              styles.modalContent,
              {
                position: 'absolute',
                top: modalPosition.top,
                right: modalPosition.right,
              },
            ]}>
            {user?._id !== creatorId && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleReport}>
                <Text style={styles.modalOptionText}>Report</Text>
              </TouchableOpacity>
            )}

            {user?._id === creatorId && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleRemoveFromPlaylist}>
                <Text style={styles.modalOptionText}>Remove from playlist</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};

export default VideoCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 5,
    gap: 10,
  },
  thumbnail: {
    width: 140,
    height: 86,
    borderRadius: 6,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    rowGap: 4,
  },
  title: {
    fontSize: fontSize.f12,
    color: '#ffffff',
    fontFamily: fonts['Poppins-SemiBold'],
  },
  meta: {
    fontSize: fontSize.f12,
    color: '#808080',
    fontFamily: fonts['Poppins-Medium'],
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
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.black,
  },

  imgContainer: {
    width: 80,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
  },
  shortContentWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
  },
  shortThumbnailContainer: {
    width: 140,
    height: 86,
    borderRadius: 6,
    overflow: 'hidden',
  },
  shortBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortThumbnailWrapper: {
    width: 60,
    height: 160,
    position: 'relative',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  shortThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  durationBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#0008',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
  },
  shortInfo: {
    rowGap: 6,
  },
  videoLengthContainer: {
    position: 'absolute',
    top: 3,
    left: 3,
    backgroundColor: '#0008',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoLengthText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
  },
  OptionContainer: {
    position: 'absolute',
    top: 0,
    right: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgb(81, 81, 81)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 12,
    padding: 5,
    width: 250,
  },
  modalOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  modalOptionText: {
    color: '#ffffff',
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
  },
});
