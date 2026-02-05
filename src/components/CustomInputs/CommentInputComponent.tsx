import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {useAppSelector} from '@store/index';
import FastImage from 'react-native-fast-image';
import { fontSize } from '@constant/fontSize';

const CommentInputComponent = ({
  onSubmit,
  isReplying,
  replyingTo,
  setReplyingTo,
  inputStyle,
  userImage,
}: CommentInputProps) => {
  const {user} = useAppSelector(state => state.user);
  const [inputText, setInputText] = useState('');

  const handlePressSubmit = () => {
    if (inputText.trim()) {
      onSubmit(inputText.trim(), isReplying, replyingTo);
      setInputText('');
      setReplyingTo(null);
    }
  };

  return (
    <View
      style={[styles.inputContainer, inputStyle, {backgroundColor: '#2F2E2E'}]}>
      {userImage && (
        <FastImage
          source={
            user?.profilePicture
              ? {uri: user.profilePicture}
              : require('@assets/images/DummyUserImage.png')
          }
          style={styles.userImage}
        />
      )}
      <TextInput
        style={[styles.input, {color: '#ffffff'}]}
        placeholder={isReplying ? 'Reply...' : 'Comment...'}
        placeholderTextColor="#CACACA"
        value={inputText}
        onChangeText={setInputText}
      />
      <TouchableOpacity
        onPress={handlePressSubmit}
        style={styles.submitIcon}
        disabled={!inputText.trim()}>
        <Image
          source={require('@assets/images/Send.png')}
          style={[
            styles.iconStyle,
            {
              tintColor: inputText.trim() ? '#8800FF' : '#CACACA',
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    width: '100%',
    shadowColor: '#222129',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: fontSize.f12,
    paddingVertical: 5,
  },
  submitIcon: {
    marginHorizontal: 10,
  },
  iconStyle: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  userImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
  },
});

export default CommentInputComponent;
