import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import CommentItem from '@components/CustomInputs/CommentItem';
import {Colors} from '@constant/colors';
import Loading from '@components/CustomLoader/Loading';

interface CommentSheetProps {
  data: any[];
  isLoading: boolean;
  isFetching: boolean;
  currentPage: number;
  onReplyPress: (commentId: string, comment: any) => void;
  onDeleteSuccess: (commentId: string) => void;
  onLoadMore: () => void;
  currentItemId: string;
}

const CommentSheet: React.FC<CommentSheetProps> = ({
  data,
  isLoading,
  isFetching,
  currentPage,
  onReplyPress,
  onDeleteSuccess,
  onLoadMore,
  currentItemId,
}) => {
  const renderComment = ({item}: {item: any}) => (
    <CommentItem
      item={item}
      onReplyPress={onReplyPress}
      onDeleteSuccess={() => onDeleteSuccess(item._id)}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyCommentsContainer}>
      <Text style={styles.emptyCommentsText}>
        No comments yet. Be the first to comment!
      </Text>
    </View>
  );

  return (
    <View style={styles.commentSheet}>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={data}
          renderItem={renderComment}
          keyExtractor={(item: any) => item?._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.1}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  commentSheet: {
    position: 'relative',
    flex: 1,
    paddingBottom: 70,
  },
  emptyCommentsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyCommentsText: {
    textAlign: 'center',
    color: Colors.white,
  },
});

export default CommentSheet;
