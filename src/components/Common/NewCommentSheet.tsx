import React, {forwardRef, useState, useEffect, useCallback} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import NewBottomSheet from '@components/CustomBottomSheet/NewBottomSheet';
import {fontSize, height} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {
  useGetContentCommentsByIdQuery,
  useAddContentCommentMutation,
} from '@rtkServices/ContentActionService';
import CommentItem from '@components/CustomInputs/CommentItem';
import CommentInputComponent from '@components/CustomInputs/CommentInputComponent';
import FastImage from 'react-native-fast-image';
import {RootState, useAppSelector} from '@store/index';
import {Alert} from 'react-native';

type NewCommentSheetProps = {
  creatorId: string;
  itemId: string;
  currentItemType: 'streams' | 'shorts' | 'posts';
};

const NewCommentSheet = forwardRef<any, NewCommentSheetProps>(
  ({itemId, currentItemType, creatorId}, ref) => {
    const {user} = useAppSelector((state: RootState) => state.user);
    const [page, setPage] = useState(1);
    const [allComments, setAllComments] = useState<any[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMorePages, setHasMorePages] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [replyingTo, setReplyingTo] = useState<any>(null);
    const [refreshReplyKey, setRefreshReplyKey] = useState<number>(0);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [addStreamComment] = useAddContentCommentMutation();

    const {
      data: commentsData,
      isLoading,
      isFetching,
      refetch: refetchComments,
    } = useGetContentCommentsByIdQuery(
      {
        id: itemId,
        page,
        limit: 10,
      },
      {
        skip: !itemId,
        refetchOnMountOrArgChange: true,
      },
    );

    // Reset when streamId changes
    useEffect(() => {
      setPage(1);
      setAllComments([]);
      setHasMorePages(true);
    }, [itemId]);

    // Keyboard visibility detection
    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        () => {
          setIsKeyboardVisible(true);
        },
      );
      const keyboardDidHideListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        () => {
          setIsKeyboardVisible(false);
        },
      );

      return () => {
        keyboardDidShowListener?.remove();
        keyboardDidHideListener?.remove();
      };
    }, []);

    // Accumulate paginated comments
    useEffect(() => {
      const newComments = commentsData?.data?.comments || [];
      if (page === 1) {
        setAllComments(newComments);
      } else if (newComments.length) {
        const existingIds = new Set(allComments.map(c => c?._id));
        const toAppend = newComments.filter(c => !existingIds.has(c?._id));
        if (toAppend.length) setAllComments(prev => [...prev, ...toAppend]);
      }
      setHasMorePages((commentsData?.data?.comments || []).length === 10);
      if (loadingMore) setLoadingMore(false);
      if (refreshing) setRefreshing(false);
    }, [commentsData, page]);

    const handleCommentSubmit = async (
      commentText: string,
      isReply: boolean = false,
      replyToComment: any = null,
    ) => {
      if (!commentText.trim() || !itemId || !user?._id) return;

      try {
        const requestBody: any = {
          creatorId: creatorId,
          contentId: itemId,
          contentType: currentItemType,
          commentText: commentText.trim(),
        };
        if (isReply && replyToComment) {
          requestBody.replyTo = replyToComment?._id;
        }
        const newComment = await addStreamComment(requestBody).unwrap();
        if (isReply && replyToComment) {
          // Update the reply count for the parent comment
          setAllComments(prev =>
            prev.map(comment =>
              comment._id === replyToComment._id
                ? {...comment, repliesCount: (comment.repliesCount || 0) + 1}
                : comment,
            ),
          );
          // Trigger refresh of replies for this comment
          setRefreshReplyKey(prev => prev + 1);
          setReplyingTo(null);
        } else {
          setAllComments(prev => [newComment.data, ...prev]);
        }
      } catch (error) {
        console.error('Failed to add comment:', JSON.stringify(error, null, 2));
        Alert.alert('Error', 'Failed to post your comment. Please try again.');
      }
    };

    const handleReplyPress = (commentId: string, comment: any) => {
      setReplyingTo(comment);
    };

    const onLoadMore = useCallback(() => {
      if (
        hasMorePages &&
        !loadingMore &&
        !isLoading &&
        !isFetching &&
        allComments.length > 0
      ) {
        setLoadingMore(true);
        setPage(prev => prev + 1);
      }
    }, [
      hasMorePages,
      loadingMore,
      isLoading,
      isFetching,
      page,
      allComments.length,
    ]);

    const handleSheetOpen = () => {
      // Refetch comments when sheet opens to get latest data
      if (itemId) {
        refetchComments();
      }
    };

    const keyboardHeight = isKeyboardVisible
      ? Platform.OS === 'ios'
        ? height * 0.68
        : height * 0.6
      : height * 0.9;

    return (
      <NewBottomSheet
        Ref={ref}
        sheetHeight={height * 0.9}
        onOpen={handleSheetOpen}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 60}>
          <View
            style={{
              height: keyboardHeight,
              backgroundColor: '#181620',
            }}>
            <View style={styles.header}>
              <Text style={styles.title}>Comments</Text>
            </View>

            <FlatList
              data={allComments}
              renderItem={({item}: {item: any}) => (
                <CommentItem
                  item={item}
                  onReplyPress={handleReplyPress}
                  onDeleteSuccess={() => {
                    setAllComments(prev =>
                      prev.filter(c => c._id !== item._id),
                    );
                  }}
                  refreshReplyKey={refreshReplyKey}
                />
              )}
              keyExtractor={(item: any, index: number) =>
                item?._id || String(index)
              }
              showsVerticalScrollIndicator={false}
              onEndReached={onLoadMore}
              onEndReachedThreshold={0.3}
              ListEmptyComponent={
                !isLoading && allComments.length === 0 ? (
                  <View style={{padding: 20, alignItems: 'center'}}>
                    <Text style={{color: Colors.grey}}>No comments yet.</Text>
                  </View>
                ) : null
              }
              ListFooterComponent={
                loadingMore ? (
                  <ActivityIndicator
                    style={{marginVertical: 10}}
                    size="small"
                    color={Colors.white}
                  />
                ) : null
              }
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={true}
              contentContainerStyle={styles.listContainer}
            />

            {/* Comment Input Container */}
            <View style={styles.inputContainer}>
              {replyingTo && (
                <View style={styles.replyingToContainer}>
                  <View style={styles.replyingToLeft}>
                    <FastImage
                      source={{
                        uri:
                          replyingTo?.user?.profilePicture ||
                          replyingTo?.user?.avatar ||
                          '',
                      }}
                      style={styles.replyProfilePic}
                    />
                    <Text style={styles.replyingToText}>
                      Replying to{' '}
                      {replyingTo?.user?.displayName ||
                        replyingTo?.user?.username ||
                        'User'}
                    </Text>
                  </View>
                  <Text
                    style={styles.cancelReplyButton}
                    onPress={() => setReplyingTo(null)}>
                    Cancel
                  </Text>
                </View>
              )}

              <CommentInputComponent
                onSubmit={(
                  text: string,
                  isReply: boolean,
                  replyToId: string | null,
                ) =>
                  handleCommentSubmit(
                    text,
                    !!replyToId,
                    allComments.find(c => c._id === replyToId) ?? null,
                  )
                }
                isReplying={!!replyingTo}
                replyingTo={replyingTo ? replyingTo._id : null}
                setReplyingTo={id =>
                  setReplyingTo(
                    id ? allComments.find(c => c._id === id) ?? null : null,
                  )
                }
                inputStyle={styles.InputComment}
                userImage={true}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </NewBottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#181620',
  },
  header: {
    padding: 15,
    borderBottomWidth: 0.3,
    borderBottomColor: '#242323',
    minHeight: 50,
  },
  title: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  content: {
    flex: 1,
    backgroundColor: 'red',
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  inputContainer: {
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: '#181620',
    marginBottom: 50,
  },
  replyingToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0 ,0,0,0.8)',
    borderRadius: 8,
    marginBottom: 10,
  },
  replyingToText: {
    fontSize: fontSize.f12,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  cancelReplyButton: {
    fontSize: fontSize.f12,
    color: '#007BFF',
  },
  InputComment: {
    bottom: 0,
    shadowColor: '#007BFF',
    backgroundColor: '#007BFF',
    marginTop: 10,
  },
  replyingToLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  replyProfilePic: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
});

export default NewCommentSheet;
