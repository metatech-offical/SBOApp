import React, {useRef, useCallback, useEffect, useState} from 'react';
import {StyleSheet, Alert} from 'react-native';
import CustomBottomSheet from '@components/CustomBottomSheet/CustomBottomSheet';
import CommentSheet from './CommentSheet';
import CommentInputSection from './CommentInputSection';
import {
  useAddContentCommentMutation,
  useGetContentCommentsByIdQuery,
} from '@rtkServices/ContentActionService';
import {useAppSelector} from '@store/index';
import {RootState} from '@store/index';

interface CommentSheetContainerProps {
  isOpen: boolean;
  onClose: () => void;
  currentItemId: string;
  currentItemType: 'posts' | 'shorts' | 'streams';
  onCommentCountChange?: (itemId: string, change: number) => void;
  contentData?: any[];
  creatorId?: string;
}

const CommentSheetContainer: React.FC<CommentSheetContainerProps> = ({
  isOpen,
  onClose,
  currentItemId,
  currentItemType,
  onCommentCountChange,
  contentData = [],
  creatorId,
}) => {
  const {user} = useAppSelector((state: RootState) => state.user);
  const sheetRef = useRef<any>(null);

  // Internal state management
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  const [addComment] = useAddContentCommentMutation();

  const {
    data: commentsApiData,
    isLoading: isLoadingComments,
    isFetching: isFetchingComments,
    refetch: refetchComments,
  } = useGetContentCommentsByIdQuery(
    {
      id: currentItemId,
      page: commentPage,
      limit: 10,
    },
    {
      skip: !isOpen || !currentItemId,
      refetchOnMountOrArgChange: true,
    },
  );

  // Handle comments data updates
  useEffect(() => {
    if (commentsApiData?.data?.comments) {
      console.log('commentsApiData', commentsApiData?.data?.comments);

      if (commentPage === 1) {
        // First page - replace all comments
        setCommentsData(commentsApiData.data.comments);
      } else {
        // Subsequent pages - append to existing comments
        setCommentsData(prevComments => [
          ...prevComments,
          ...commentsApiData.data.comments,
        ]);
      }

      // Check if there are more comments to load
      const pagination = commentsApiData.data.pagination;
      if (pagination) {
        setHasMoreComments(pagination.page < pagination.totalPages);
      }
    }
  }, [commentsApiData, commentPage]);

  // Reset state when currentItemId changes or when sheet opens
  useEffect(() => {
    if (currentItemId && isOpen) {
      setCommentsData([]);
      setReplyingTo(null);
      setCommentPage(1);
      setHasMoreComments(true);
    }
  }, [currentItemId, isOpen]);

  // Reset state when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setCommentsData([]);
      setReplyingTo(null);
      setCommentPage(1);
      setHasMoreComments(true);
    }
  }, [isOpen]);

  const handleCommentSubmit = async (
    commentText: string,
    isReply: boolean = false,
    replyToComment: any = null,
  ) => {
    if (!commentText.trim() || !currentItemId || !user?._id) return;

    try {
      const currentItem = contentData.find(
        (item: any) => item?._id === currentItemId,
      );
      const itemAuthorId = creatorId || currentItem?.creator?._id;

      const requestBody: any = {
        creatorId: itemAuthorId,
        contentId: currentItemId,
        contentType: currentItemType,
        commentText: commentText.trim(),
      };

      if (isReply && replyToComment) {
        requestBody.replyTo = replyToComment?._id;
      }

      const newComment = await addComment(requestBody).unwrap();

      if (isReply && replyToComment) {
        handleCancelReply();
        // Refetch to get updated reply structure
        refetchComments();
      } else {
        // Add new comment to the beginning of the list
        setCommentsData(prevComments => [newComment.data, ...prevComments]);
        onCommentCountChange?.(currentItemId, 1);
      }
    } catch (error) {
      console.log('Failed to add comment:', JSON.stringify(error, null, 2));
      Alert.alert('Error', 'Failed to post your comment. Please try again.');
    }
  };

  const handleDeleteSuccess = (commentId: string) => {
    setCommentsData(prevComments =>
      prevComments.filter(c => c._id !== commentId),
    );
    onCommentCountChange?.(currentItemId, -1);
  };

  const handleClose = () => {
    console.log('handleClose');
    onClose();
    handleCancelReply();
  };

  const handleReplyPress = (commentId: string, comment: any) => {
    setReplyingTo(comment);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleSetReplyingTo = (id: string | null) => {
    setReplyingTo(id ? commentsData.find(c => c._id === id) ?? null : null);
  };

  const handleLoadMoreComments = useCallback(() => {
    if (hasMoreComments && !isFetchingComments && isOpen) {
      setCommentPage(prevPage => prevPage + 1);
    }
  }, [hasMoreComments, isFetchingComments, isOpen]);

  const RenderCommentSheet = useCallback(
    () => (
      <CommentSheet
        data={commentsData}
        isLoading={isLoadingComments && commentPage === 1}
        isFetching={isFetchingComments}
        currentPage={commentPage}
        onReplyPress={handleReplyPress}
        onDeleteSuccess={handleDeleteSuccess}
        onLoadMore={handleLoadMoreComments}
        currentItemId={currentItemId}
      />
    ),
    [
      commentsData,
      isLoadingComments,
      isFetchingComments,
      commentPage,
      currentItemId,
      handleLoadMoreComments,
    ],
  );

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <CustomBottomSheet
        label="Comments"
        ref={sheetRef}
        index={5}
        renderView={RenderCommentSheet}
        onClose={handleClose}
        onPress={handleClose}
      />

      <CommentInputSection
        replyingTo={replyingTo}
        onSubmit={handleCommentSubmit}
        onCancelReply={handleCancelReply}
        allCommentsData={commentsData}
        setReplyingTo={handleSetReplyingTo}
        inputStyle={styles.inputComment}
        userImage={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
  inputComment: {
    bottom: 0,
    shadowColor: '#007BFF',
    backgroundColor: '#007BFF',
    marginTop: 10,
    zIndex: 1000000,
  },
});

export default CommentSheetContainer;
