import React, {useState, useCallback} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from 'react-native';

interface SeeMoreProps {
  text: string;
  numberOfLines?: number;
  showMoreText?: string;
  showLessText?: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  linkStyle?: TextStyle;
}

const SeeMore: React.FC<SeeMoreProps> = ({
  text,
  numberOfLines = 1,
  showMoreText = 'See more',
  showLessText = 'See less',
  containerStyle,
  textStyle,
  linkStyle,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [shouldShowMore, setShouldShowMore] = useState(false);

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (!shouldShowMore && e.nativeEvent.lines.length > numberOfLines) {
        setShouldShowMore(true);
      }
    },
    [shouldShowMore, numberOfLines],
  );

  return (
    <View style={containerStyle}>
      <Text
        pointerEvents="none"
        style={[styles.text, textStyle, styles.textabsolute]}
        onTextLayout={onTextLayout}>
        {text}
      </Text>
      <Text
        style={[styles.text, textStyle]}
        numberOfLines={expanded ? undefined : numberOfLines}>
        {text}
      </Text>

      {shouldShowMore && (
        <TouchableOpacity onPress={() => setExpanded(prev => !prev)}>
          <Text style={[styles.link, linkStyle]}>
            {expanded ? showLessText : showMoreText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#d7dfe6ff',
  },
  textabsolute: {position: 'absolute', opacity: 0},
});

export default SeeMore;
