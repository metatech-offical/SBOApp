import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {Colors} from '@constant/colors';
import {VideoIcon} from '@assets/svg/HomeScreenIcon';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {navigate} from '@navigation/utils';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '@store/index';

export default function SugetionList({
  data,
  isLoading,
}: {
  data: SearchResultData;
  isLoading: boolean;
}) {
  const navigation = useNavigation<any>();

  const {user} = useSelector((state: RootState) => state.user);

  const onPress = (profile: usersItem | shorts) => {
    if (user?._id === profile?._id) {
      if (user?.membership === 'creator') {
        navigation.navigate('HomeScreen', {
          screen: 'CreatorProfile',
          params: {userId: profile._id},
        });
      } else {
        navigation.navigate('HomeScreen', {
          screen: 'UserProfile',
          params: {userId: profile._id},
        });
      }
    } else {
      navigate('OtherUserProfile', {userId: profile._id});
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="small" color={Colors.white} />
      ) : (
        <View>
          {data?.users?.length > 0 &&
            data?.users?.slice(0, 4).map(item => (
              <Pressable
                onPress={() => onPress(item)}
                style={styles.userItem}
                key={item._id}>
                <View style={styles.userItemLeft}>
                  <Text style={styles.userItemText}>
                    @{item.username || item.displayName}
                  </Text>
                </View>
                {item?.isLive && (
                  <View style={styles.userItemRight}>
                    <VideoIcon width={14} fill={Colors.white} height={14} />
                  </View>
                )}
              </Pressable>
            ))}

          {data?.shorts?.length > 0 &&
            data?.shorts?.slice(0, 4).map(item => (
              <Pressable
                onPress={() => {
                  navigate('ShortsFeed', {
                    shortsId: item?._id || item?.id,
                  });
                }}
                style={styles.userItem}
                key={item._id}>
                <View style={styles.userItemLeft}>
                  <Text style={styles.userItemText}>{item.description}</Text>
                </View>
              </Pressable>
            ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 30,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEF21',
  },
  userItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  userItemText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
  },
  userItemRight: {
    padding: 2,
    backgroundColor: '#FF2C35',
    borderRadius: 4,
  },
});
