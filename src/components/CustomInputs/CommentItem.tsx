import React, {useMemo, useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {RootState, useAppSelector} from '@store/index';
import {fonts} from '@constant/fontfamily';
import {getTimeDifference} from '@utils/general';
import {ArrowUP, ArrowDown} from '@assets/svg/AuthFlowIcons';
import {
  useDeleteContentCommentMutation,
  useGetContentCommentsRepliesQuery,
} from '@rtkServices/ContentActionService';
import {DeleteIcon, ReplyIcon} from '@assets/svg/ShortsIcon';
import FastImage from 'react-native-fast-image';
import {fontSize} from '@constant/fontSize';

const CommentItem = ({
  item,
  onReplyPress,
  onDeleteSuccess,
  refreshReplyKey,
}: any) => {
  const [showReplies, setShowReplies] = useState(false);
  const {user} = useAppSelector((state: RootState) => state.user);
  const [replies, setReplies] = useState<any[]>([]);
  const [shouldFetchReplies, setShouldFetchReplies] = useState(false);

  const {
    data: fetchReplies,
    isLoading,
    isFetching,
  } = useGetContentCommentsRepliesQuery(
    {
      comment_id: item._id,
    },
    {
      skip: !shouldFetchReplies, // Only fetch when needed
      refetchOnMountOrArgChange: true,
    },
  );

  const [showDelete, setShowDelete] = useState(false);
  const [deleteComment] = useDeleteContentCommentMutation();
  const hasReplies = item?.repliesCount > 0;

  // Update replies when data is fetched
  useEffect(() => {
    if (fetchReplies?.data?.replies) {
      setReplies(fetchReplies.data.replies);
    }
  }, [fetchReplies]);

  const handleToggleReplies = async () => {
    if (!showReplies) {
      // If replies haven't been fetched yet, trigger the fetch
      if (replies.length === 0) {
        setShouldFetchReplies(true);
      }
      setShowReplies(true);
    } else {
      setShowReplies(false);
    }
  };

  // Listen for reply additions and refresh replies
  useEffect(() => {
    if (refreshReplyKey > 0 && showReplies) {
      // Trigger a refetch of replies when refresh key changes
      setShouldFetchReplies(false);
      setTimeout(() => {
        setShouldFetchReplies(true);
      }, 100);
    }
  }, [refreshReplyKey, showReplies]);

  const handleLongPress = () => {
    if (item?.user?._id === user?._id) {
      setShowDelete(!showDelete);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteComment({comment_id: item._id}).unwrap();
              onDeleteSuccess?.();
            } catch (error) {
              console.error('Delete failed:', error);
              Alert.alert(
                'Error',
                'Failed to delete comment. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.commentItem}>
      <TouchableOpacity onLongPress={handleLongPress} activeOpacity={1}>
        <View style={styles.commentHeader}>
          <FastImage
            source={
              item?.user?.profilePicture
                ? {uri: item?.user?.profilePicture}
                : require('@assets/images/DummyUserImage.png')
            }
            style={styles.profilePic}
          />
          <View style={styles.commentTextContainer}>
            <View style={styles.userInfoRow}>
              <View style={styles.row}>
                <Text style={styles.username}>
                  {item?.user?.displayName || item?.user?.username || 'User'}
                </Text>
                <Text style={styles.commentTime}>
                  {getTimeDifference(item?.createdAt)}
                </Text>
              </View>
              {showDelete && (
                <TouchableOpacity onPress={confirmDelete}>
                  <DeleteIcon style={styles.replyIcon} height={22} width={22} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.commentText}>{item?.commentText}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.replyContainer}>
        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => onReplyPress?.(item._id, item)}>
          <ReplyIcon style={styles.replyIcon} height={18} width={18} />
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>

        {hasReplies && (
          <TouchableOpacity
            style={styles.replyButton}
            onPress={handleToggleReplies}>
            {showReplies ? (
              <>
                <ArrowUP width={20} height={20} fill={'#ffffff'} />
                <Text style={styles.replyButtonText}>Hide replies</Text>
              </>
            ) : (
              <>
                <ArrowDown width={20} height={20} fill={'#ffffff'} />
                <Text
                  style={
                    styles.replyButtonText
                  }>{`${item.repliesCount} replies`}</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {showReplies && (
        <View style={styles.repliesContainer}>
          {(isLoading || isFetching) && replies.length === 0 ? (
            <Text style={styles.replyButtonText}>Loading...</Text>
          ) : (
            replies?.map(reply => (
              <View key={reply._id} style={styles.replyItem}>
                <FastImage
                  style={styles.replyProfilePic}
                  source={
                    reply?.user?.profilePicture
                      ? {uri: reply?.user?.profilePicture}
                      : require('@assets/images/DummyUserImage.png')
                  }
                />
                <View style={styles.replyTextContainer}>
                  <View style={styles.userInfoRow}>
                    <Text style={styles.username}>
                      {reply?.user?.displayName || 'User'}
                    </Text>
                    <Text style={styles.commentTime}>
                      {reply?.createdAt
                        ? getTimeDifference(reply.createdAt)
                        : 'Unknown time'}
                    </Text>
                  </View>
                  <Text style={styles.commentText}>{reply?.commentText}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  commentItem: {
    padding: 10,
    width: '100%',
    paddingHorizontal: 5,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentTextContainer: {
    flex: 1,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    columnGap: 10,
  },
  username: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: '#ffffff',
  },
  commentTime: {
    fontSize: fontSize.f12,
    color: '#ffffff',
  },
  commentText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: '#ffffff',
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingLeft: 48,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingVertical: 4,
    // paddingHorizontal: 8,
  },
  replyButtonText: {
    fontSize: fontSize.f12,
    color: '#ffffff',
  },
  repliesContainer: {
    marginTop: 8,
    paddingLeft: 48,
  },
  replyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  replyProfilePic: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
  },
  replyTextContainer: {
    flex: 1,
  },
  replyIcon: {
    height: 15,
    width: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
});

export default CommentItem;
