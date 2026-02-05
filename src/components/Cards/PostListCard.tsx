import {VerifiedIcon} from '@assets/svg/AuthFlowIcons';
import {CommentIcon, MoreIcon, ShareIcon} from '@assets/svg/CommonIcons';
import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {RootState, useAppSelector} from '@store/index';
import {
  useDeletePostMutation,
  useLikeContentMutation,
  useSaveUnsaveContentMutation,
} from '@rtkServices/ContentActionService';
import {fonts} from '@constant/fontfamily';
import PostCarousel from '@components/CustomCarosal/PostCarousel';
import {fontSize, hp, wp} from '@constant/fontSize';
import moment from 'moment';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';

const PostListCard = ({
  postData,
  onComment,
  onShare,
  onMorePress,
  onUserPress,
  showVerifiedBadge = true,
  showActionBar = true,
  cardStyle,
  textColor = Colors.white,
  backgroundColor = 'transparent',
  borderRadius = 16,
  margin = 16,
  padding = 0,
}: PostListCardProps) => {
  console.log('postData', postData);
  const {showError, showSuccess} = useToastMessage();
  const {user} = useAppSelector((state: RootState) => state.user);
  const [liked, setLiked] = useState(postData?.isLiked || false);
  const [likeCount, setLikeCount] = useState(postData?.likesCount || 0);
  const [showMore, setShowMore] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({top: 0, right: 0});
  const [isSaved, setIsSaved] = useState<boolean>(postData?.isSaved || false);
  const [deletePostReq, deletePostRes] = useDeletePostMutation();

  const optionButtonRef = useRef<View>(null);
  const [saveUnsaveContent] = useSaveUnsaveContentMutation();
  const [likeShortsReq] = useLikeContentMutation();

  const handleLikePress = useCallback(
    async (short_id: string) => {
      const prevLike = liked;
      const prevNumberLiked = likeCount;
      setLiked(!prevLike);
      setLikeCount(prevLike ? prevNumberLiked - 1 : prevNumberLiked + 1);
      try {
        const res = await likeShortsReq({
          content_id: short_id,
          contentType: 'posts',
        }).unwrap();
      } catch (error) {
        console.error('Error liking shorts:', error);
        setLiked(prevLike);
        setLikeCount(prevNumberLiked);
      }
    },
    [liked, likeCount, likeShortsReq],
  );

  const handleComment = () => {
    if (onComment) {
      onComment(postData?._id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(postData?._id, postData);
    }
  };

  const handleMorePress = () => {
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

  const handleUserPress = () => {
    if (onUserPress) {
      onUserPress(postData?.creator, postData?._id);
    }
  };

  const handleSaveUnsaveContent = async () => {
    try {
      const res = await saveUnsaveContent({
        content_id: postData?._id,
        contentType: 'posts',
        action: isSaved ? 'unsave' : 'save',
      });
      if (res?.data) {
        setModalVisible(false);
        showSuccess(res?.data?.message || '');
        setIsSaved(!isSaved);
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'An error occurred');
      }
    } catch (error) {
      console.log('Save/Unsave error:', error);
      showError('An error occurred');
    }
  };

  const handleDelete = async () => {
    if (
      !postData?._id ||
      typeof postData._id !== 'string' ||
      postData._id.trim() === ''
    ) {
      showError('Invalid post ID');
      return;
    }

    try {
      const res = await deletePostReq({postId: postData._id});
      if (res?.data) {
        showSuccess(res.data.message || 'Post deleted successfully');
      } else if (res?.error) {
        showError(res.error.data?.message || 'Failed to delete post');
      } else {
        showError('Unexpected response format');
      }
    } catch (error) {
      console.error('Delete post error:', error);
      showError('Failed to delete post');
    }
  };
  const handleReport = () => {
    setModalVisible(false);
    // TODO: Implement report functionality
    console.log('Report post:', postData?._id);
    showSuccess('Report functionality to be implemented');
  };

  const handleNotInterested = () => {
    setModalVisible(false);
    // TODO: Implement not interested functionality
    showSuccess('Not interested functionality to be implemented');
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  if (!postData) {
    return null;
  }

  const dynamicStyles = {
    card: {
      backgroundColor,
      borderRadius,
      margin,
      padding,
      ...cardStyle,
    },
    text: {
      color: textColor,
    },
  };
  return (
    <View style={[styles.card, dynamicStyles.card]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileSection}
          onPress={handleUserPress}
          activeOpacity={0.7}>
          {postData?.creator?.profilePicture ? (
            <FastImage
              source={{
                uri: postData.creator?.profilePicture,
              }}
              style={styles.profileImage}
            />
          ) : (
            <FastImage
              source={require('@assets/images/DummyUserImage.png')}
              style={styles.profileImage}
            />
          )}

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={[styles.username, dynamicStyles.text]}>
                {postData?.creator?.displayName ||
                  postData?.creator?.username ||
                  'Anonymous'}
              </Text>
              {showVerifiedBadge && postData?.creator?.isVerified && (
                <VerifiedIcon width={15} height={15} />
              )}
            </View>
            <Text style={styles.timestamp}>
              {moment(postData?.createdAt)?.fromNow() || ''}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          ref={optionButtonRef}
          style={styles.menuButton}
          onPress={handleMorePress}
          activeOpacity={0.7}>
          <MoreIcon />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      {postData?.caption && (
        <TouchableOpacity
          onPress={() => setShowMore(!showMore)}
          activeOpacity={0.8}>
          <Text
            numberOfLines={showMore ? undefined : 2}
            style={[styles.postText, dynamicStyles.text]}>
            {postData.caption}
          </Text>
        </TouchableOpacity>
      )}

      {/* Post Image */}
      {postData?.photoUrls && postData?.photoUrls?.length > 0 && (
        <View style={styles.imageContainer}>
          {postData.photoUrls.length === 1 ? (
            <FastImage
              source={{uri: postData.photoUrls[0]}}
              style={styles.postImage}
            />
          ) : (
            <PostCarousel
              images={postData.photoUrls}
              height={wp('100%')}
              autoPlay={false}
              borderRadius={12}
            />
          )}
        </View>
      )}

      {/* Action Buttons */}
      {showActionBar && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.actionButton}
            hitSlop={20}
            onPress={() => handleLikePress(postData?._id)}
            activeOpacity={0.7}>
            <View style={styles.iconContainer}>
              <FastImage
                source={
                  liked
                    ? require('@assets/images/likeIcon.png')
                    : require('@assets/images/unLikeIcon.png')
                }
                style={styles.actionIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.actionText}>{formatCount(likeCount)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            hitSlop={20}
            onPress={handleComment}
            activeOpacity={0.7}>
            <FastImage
              source={require('@assets/images/commentIcon.png')}
              style={styles.actionIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            hitSlop={20}
            onPress={handleShare}
            activeOpacity={0.7}>
            <FastImage
              source={require('@assets/images/shareIcon.png')}
              style={styles.actionIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Options Modal */}
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
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleSaveUnsaveContent}>
              <Text style={styles.modalOptionText}>
                {isSaved ? 'Unsave' : 'Save'}
              </Text>
            </TouchableOpacity>

            {postData?.creator?._id === user?._id && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleDelete}>
                <Text style={styles.modalOptionText}>Delete</Text>
              </TouchableOpacity>
            )}

            {postData?.creator?._id !== user?._id && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleReport}>
                <Text style={styles.modalOptionText}>Report</Text>
              </TouchableOpacity>
            )}

            {postData?.creator?._id !== user?._id && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleNotInterested}>
                <Text style={styles.modalOptionText}>Not interested</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    marginRight: 6,
  },
  timestamp: {
    color: '#888',
    marginTop: 2,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
  },
  menuButton: {
    padding: 8,
  },
  postText: {
    fontSize: fontSize.f14,
    lineHeight: 24,
    marginBottom: hp('1'),
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
  },
  postImage: {
    width: wp('95%'),
    height: wp('95%'),
    resizeMode: 'cover',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 0,
    marginLeft: wp('4'),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  iconContainer: {
    marginRight: 8,
  },
  actionText: {
    marginLeft: 4,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: Colors.black,
    borderRadius: 12,
    padding: 5,
    width: 200,
  },
  modalOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  modalOptionText: {
    color: Colors.white,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
  },
  actionIcon: {
    height: 18,
    width: 18,
  },
});

export default PostListCard;
