import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import React, {memo, useRef, useEffect, useState} from 'react';
import {fontSize, hp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {charToRgbArray} from '@utils/general';
import {Colors} from '@constant/colors';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

// Function to get initials from username
const getInitials = (username: string): string => {
  const names = username.split(' ');
  if (names.length >= 2) {
    return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
  }
  return names[0].charAt(0).toUpperCase();
};

function LiveChatList({chatData}: {chatData: ConvertedMessage[]}) {
  const flatListRef = useRef<FlatList>(null);
  const [scrollY] = useState(new Animated.Value(0));
  const [layoutHeight, setLayoutHeight] = useState(0);

  // Auto-scroll to bottom when new data is added
  useEffect(() => {
    if (chatData.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  }, [chatData.length]);

  const renderChatItem = React.useCallback(
    ({item, index}: {item: ConvertedMessage; index: number}) => {
      const char = getInitials(item.username);
      const color = charToRgbArray(char);

      // Calculate opacity based on scroll position and item position
      // Only apply fade effect when scrolled up from bottom
      const fadeOpacity = scrollY.interpolate({
        inputRange: [
          Math.max(0, index * 60 - 150), // Start fading 150px before item reaches top
          Math.max(60, index * 60), // Fully transparent when item is at top
        ],
        outputRange: [1, 0], // From fully visible to transparent
        extrapolate: 'clamp',
      });

      return (
        <Animated.View style={[styles.chatItem, {opacity: fadeOpacity}]}>
          <View style={styles.messageContainer}>
            {/* Avatar with initials */}
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: `rgba(${color[0]},${color[1]},${color[2]}, 0.5)`,
                },
              ]}>
              <Text
                style={[
                  styles.avatarText,
                  {color: `rgba(${color[0]},${color[1]},${color[2]}, 1)`},
                ]}>
                {char}
              </Text>
            </View>

            {/* Message content */}
            <View style={styles.messageContent}>
              <Text style={styles.username}>@{item.username}</Text>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          </View>
        </Animated.View>
      );
    },
    [scrollY],
  );

  const handleContentSizeChange = () => {
    // Also scroll to bottom when content size changes
    flatListRef.current?.scrollToEnd({animated: true});
  };

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {useNativeDriver: false},
  );

  return (
    <View style={styles.container}>
      {/* Gradient overlay at top for smoother fade effect */}
      <View style={styles.topGradientOverlay} pointerEvents="none" />

      <Animated.FlatList
        ref={flatListRef}
        data={chatData}
        renderItem={renderChatItem}
        keyExtractor={item => item.id.toString()}
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatListContent}
        nestedScrollEnabled={true}
        onContentSizeChange={handleContentSizeChange}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        onLayout={event => {
          setLayoutHeight(event.nativeEvent.layout.height);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: hp('35'),
    backgroundColor: 'transparent',
    position: 'relative',
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatListContent: {
    paddingBottom: 20,
    paddingTop: 50, // Add top padding to account for fade area
    flexGrow: 1,
    justifyContent: 'flex-end', // Start from bottom when content is small
  },
  topGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    background:
      'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  chatItem: {
    marginBottom: hp('0.3'),
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 10,
    paddingVertical: 5,
    maxWidth: screenWidth * 0.85,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  avatarText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  messageContent: {
    flex: 1,
    minWidth: 0,
  },
  username: {
    marginBottom: hp('0.1'),
    fontSize: fontSize.f12,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  messageText: {
    fontSize: fontSize.f12,
    color: Colors.white,
    lineHeight: 18,
    fontFamily: 'Poppins-Regular',
  },
});

export default memo(LiveChatList);
