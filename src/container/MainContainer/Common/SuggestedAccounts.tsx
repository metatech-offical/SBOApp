import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '@constant/colors';
import {fontSize, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {useUserSuggestedAccountQuery} from '@rtkServices/HomeService';
import {navigate, navigateBack} from '@navigation/utils';
import Loader from '@components/CustomLoader/Loader';
import NodataFound from '@components/DataEmpty/NodataFound';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {UserIcon} from '@assets/svg/CommonIcons';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import {useUnsubscribeFromCreatorMutation} from '@rtkServices/SubcriptionService';
import {useToastMessage} from '@hooks/useToastMessage';
import {DUMMY_SUGGESTED_ACCOUNTS} from '@utils/dummyHome';

const SuggestedAccountItem = ({
  item,
  onSubscribe,
}: {
  item: any;
  onSubscribe: (item: any) => void;
}) => {
  return (
    <Pressable style={styles.accountItem}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>{item?.username?.charAt(0)}</Text>
        </View>
      </View>
      <View style={styles.accountInfo}>
        <Text style={styles.username}>{item?.username}</Text>
      </View>
      {/* {item?.isSubscribed && (
        <TouchableOpacity
          style={styles.unsubscribeButton}
          onPress={e => {
            e.stopPropagation();
            onSubscribe(item);
          }}>
          <Text style={styles.unsubscribeButtonText}>{'Unsubscribe'}</Text>
        </TouchableOpacity>
      )} */}
      <TouchableOpacity
        style={styles.unsubscribeButton}
        onPress={e => {
          navigate('OtherUserProfile', {userId: item?._id});
        }}>
        <Text style={styles.unsubscribeButtonText}>{'View Profile'}</Text>
      </TouchableOpacity>
    </Pressable>
  );
};
export default function SuggestedAccounts() {
  const {showError, showSuccess} = useToastMessage();
  const [unsubscribe] = useUnsubscribeFromCreatorMutation();

  // Pagination state for subscribed creators
  const [creatorsPage, setCreatorsPage] = useState(1);
  const [creatorsData, setCreatorsData] = useState<any[]>([]);
  const [creatorsHasMore, setCreatorsHasMore] = useState(true);
  const [localAccounts, setLocalAccounts] = useState<any[]>([]);

  const {
    data: suggestedAccount,
    isLoading,
    isFetching,
    refetch,
  } = useUserSuggestedAccountQuery({
    page: creatorsPage,
    limit: 10,
  });

  const suggestedAccounts = suggestedAccount?.data?.data || [];
  const totalRecord =
    suggestedAccounts.length > 0
      ? suggestedAccount?.data?.pagination?.totalRecords || 0
      : DUMMY_SUGGESTED_ACCOUNTS.length;

  useEffect(() => {
    if (suggestedAccounts?.length > 0) {
      setLocalAccounts(suggestedAccounts);
    }
  }, [suggestedAccounts]);

  useEffect(() => {
    if (suggestedAccounts) {
      if (creatorsPage === 0) {
        setCreatorsData(suggestedAccounts);
      } else {
        setCreatorsData(prev => [...prev, ...suggestedAccounts]);
      }

      // Check if there are more pages
      const total = suggestedAccount?.data?.pagination?.totalRecords || 0;
      const currentTotal = creatorsData?.length + suggestedAccounts?.length;
      setCreatorsHasMore(currentTotal < total);
    }
  }, [suggestedAccounts]);

  const handleLoadMore = useCallback(() => {
    if (creatorsHasMore && !isLoading && !isFetching) {
      setCreatorsPage(prev => prev + 1);
    }
  }, [creatorsHasMore, isLoading, isFetching]);

  if (isLoading) {
    return <Loader visible={isLoading} />;
  }

  const handleRefreshCreators = useCallback(() => {
    setCreatorsPage(0);
    setCreatorsData([]);
    setLocalAccounts([]);
    setCreatorsHasMore(true);
  }, []);

  const handleSubscribeToggle = useCallback(
    (item: any) => {
      if (item?.isSubscribed) {
        setLocalAccounts(prev =>
          prev.map(account =>
            account._id === item._id
              ? {...account, isSubscribed: false}
              : account,
          ),
        );

        unsubscribe({creatorId: item?._id})
          .unwrap()
          .then(() => {
            showSuccess('Unsubscribed successfully');
            refetch();
          })
          .catch(error => {
            setLocalAccounts(prev =>
              prev.map(account =>
                account._id === item._id
                  ? {...account, isSubscribed: true}
                  : account,
              ),
            );
            showError(error?.data?.message || 'Something went wrong');
          });
      }
    },
    [unsubscribe, showError, showSuccess, refetch],
  );

  return (
    <View style={styles.container}>
      <GlowBackground />
      <StackHeader
        onBackPress={() => navigateBack()}
        title="Subscriptions"
        rightIconStyle={{backgroundColor: 'transparent', borderWidth: 0}}
        rightIcon={true}
        rightIconText={`${totalRecord}`}
        icon={<UserIcon />}
        showArrowDown={false}
      />
      <FlatList
        data={
          localAccounts.length > 0
            ? localAccounts
            : DUMMY_SUGGESTED_ACCOUNTS
        }
        refreshControl={
          <CustomRefreshControler
            refreshing={isFetching && creatorsPage === 1}
            onRefresh={handleRefreshCreators}
          />
        }
        renderItem={({item}) => {
          return (
            <SuggestedAccountItem
              item={item}
              onSubscribe={handleSubscribeToggle}
            />
          );
        }}
        keyExtractor={item => item._id}
        ListEmptyComponent={<NodataFound />}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarCircle: {
    width: wp('10'),
    height: wp('10'),
    borderRadius: wp('6'),
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.black,
    textTransform: 'uppercase',
  },
  accountInfo: {
    flex: 1,
  },
  username: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    marginBottom: 4,
  },
  unsubscribeButton: {
    // backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.white,
  },
  unsubscribeButtonText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
});
