import {EyeShowIcon} from '@assets/svg/AuthFlowIcons';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  thumbnail: any;
  userName: string;
  title: string;
  views?: string;
  onPress?: () => void;
}

const SubscriptionCard: React.FC<Props> = ({
  thumbnail,
  userName,
  title,
  views = '0',
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.8}>
      <ImageBackground
        source={{uri: thumbnail}}
        style={styles.thumbnail}
        imageStyle={styles.imageStyle}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        />
        <View style={styles.topRow}>
          <View style={styles.iconBadge}>
            {/* <MaterialIcons name="videocam" size={20} color="#fff" /> */}
          </View>
          <View style={styles.viewsBadge}>
            <EyeShowIcon color={Colors.white} height={18} width={18} />
            <Text style={styles.viewsText}>{views}</Text>
          </View>
        </View>
        <View style={styles.bottomOverlay}>
          <View style={styles.userRow}>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
      </ImageBackground>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default SubscriptionCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: 130,
    margin: 10,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 6,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  imageStyle: {
    borderRadius: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  iconBadge: {
    borderRadius: 6,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsBadge: {
    backgroundColor: 'rgba(60,60,60,0.7)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  viewsText: {
    fontSize: fontSize.f10,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  bottomOverlay: {
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 12,
    // backgroundColor: 'rgba(0,0,0,0.10)',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginRight: 6,
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Bold'],
  },
  title: {
    marginTop: 8,
    marginLeft: 2,
    width: '95%',
    fontSize: fontSize.f12,
    color: Colors.grey,
    fontFamily: fonts['Poppins-Regular'],
  },
});
