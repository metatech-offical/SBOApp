import {ArrowDown, ArrowUP, BackArrow} from '@assets/svg/AuthFlowIcons';
import {HeartIcon} from '@assets/svg/HomeScreenIcon';
import {LiveLikeIcon} from '@assets/svg/LiveSCreenIcon';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Pressable,
} from 'react-native';
import FastImage from 'react-native-fast-image';

interface LiveInputAndDetailsProps {
  message: string;
  setMessage: (msg: string) => void;
  onSend: () => void;
  streamData: any;
  handleLike: any;
  like: any;
  likeCount: any;
  disabled: any;
  showChat?: boolean;
  setShowChat?: (show: boolean) => void;
}

const LiveInputAndDetails: React.FC<LiveInputAndDetailsProps> = ({
  message,
  setMessage,
  onSend,
  streamData,
  handleLike,
  like,
  likeCount,
  disabled,
  showChat = true,
  setShowChat,
}) => {
  const [viewMore, setViewMore] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Background overlay */}
      <View style={styles.overlay}>
        {/* Top section with chat input and heart */}
        <View style={styles.topSection}>
          <View style={styles.chatContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Chat..."
              placeholderTextColor="#FFFFFF80"
              value={message}
              onChangeText={setMessage}
              returnKeyType="send"
              onSubmitEditing={onSend}
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowChat && setShowChat(!showChat)}
            style={styles.dropdownButton}>
            {showChat ? (
              <ArrowUP fill={Colors.white} />
            ) : (
              <ArrowDown fill={Colors.white} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLike}
            disabled={disabled}
            style={styles.heartContainer}>
            <FastImage
              source={
                like
                  ? require('../../../assets/images/like2.png')
                  : require('../../../assets/images/like.png')
              }
              style={{height: 20, width: 20}}
            />
            <Text style={styles.heartCount}>{likeCount}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom section with title and progress bar */}
        <Pressable
          onPress={() => setViewMore(!viewMore)}
          style={styles.bottomSection}>
          <Text
            numberOfLines={viewMore ? undefined : 1}
            style={styles.titleText}>
            {streamData?.title}
          </Text>
          {viewMore && (
            <Text
              numberOfLines={viewMore ? undefined : 1}
              style={styles.description}>
              {streamData?.description}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,

    justifyContent: 'space-between',
    paddingHorizontal: 16,

    paddingBottom: 10,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    paddingHorizontal: 5,
    // paddingVertical: 12,s
    flex: 1,
    // marginRight: 15,
    height: 40,
  },
  chatInput: {
    flex: 1,
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  dropdownButton: {
    marginLeft: 8,
    marginRight: 5,
  },
  heartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 20,
    width: 60,
    // paddingHorizontal: 5,
    paddingVertical: 8,
  },
  heartCount: {
    marginLeft: 6,
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  bottomSection: {
    alignItems: 'flex-start',
  },
  titleText: {
    color: Colors.white,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Bold'],
    // marginBottom: 16,
    lineHeight: 24,
  },

  description: {
    color: Colors.grey,
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
    // marginBottom: 16,
    lineHeight: 24,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '60%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '70%',
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
});

export default LiveInputAndDetails;
