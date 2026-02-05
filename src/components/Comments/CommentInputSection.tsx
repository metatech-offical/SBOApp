import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import CommentInputComponent from '@components/CustomInputs/CommentInputComponent';
import {fonts} from '@constant/fontfamily';
import { Colors } from '@constant/colors';
import { fontSize } from '@constant/fontSize';

interface CommentInputSectionProps {
  replyingTo: any;
  onSubmit: (text: string, isReply: boolean, replyToId: string | null) => void;
  onCancelReply: () => void;
  allCommentsData: any[];
  setReplyingTo: (id: string | null) => void;
  inputStyle?: any;
  userImage?: boolean;
}

const CommentInputSection: React.FC<CommentInputSectionProps> = ({
  replyingTo,
  onSubmit,
  onCancelReply,
  allCommentsData,
  setReplyingTo,
  inputStyle,
  userImage = true,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
      style={styles.keyboardAvoidingView}>
      <View style={styles.inputContainer}>
        {replyingTo && (
          <View style={styles.replyingToContainer}>
            <View style={styles.replyingToLeft}>
              <FastImage
                source={{uri: replyingTo?.user?.profilePicture || ''}}
                style={styles.replyProfilePic}
              />
              <Text style={styles.replyingToText}>
                Replying to {replyingTo?.user?.displayName || 'User'}
              </Text>
            </View>
            <TouchableOpacity onPress={onCancelReply}>
              <Text style={styles.cancelReplyButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <CommentInputComponent
          onSubmit={(
            text: string,
            isReply: boolean,
            replyToId: string | null,
          ) =>
            onSubmit(
              text,
              !!replyToId,
              allCommentsData.find(c => c._id === replyToId) ?? null,
            )
          }
          isReplying={!!replyingTo}
          replyingTo={replyingTo ? replyingTo._id : null}
          setReplyingTo={setReplyingTo}
          inputStyle={inputStyle}
          userImage={userImage}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputContainer: {
    paddingHorizontal: 10,
  },
  replyingToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
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
  replyingToText: {
    fontSize: fontSize.f12,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  cancelReplyButton: {
    fontSize: fontSize.f10,
    color: '#007BFF',
  },
});

export default CommentInputSection;
