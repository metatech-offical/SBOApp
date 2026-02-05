import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import Loader from '@components/CustomLoader/Loader';
import NodataFound from '@components/DataEmpty/NodataFound';
import BlockUserListComp from '@components/ScreenLayouts/SettingsComponent/BlockUserListComp';
import {BlockedUsersListProps} from '@navigation/screens';
import {useGetBlockedUsersListQuery} from '@rtkServices/SettingsService';
import {View, Text, StyleSheet, FlatList} from 'react-native';

const BlockedUsersList = ({navigation}: BlockedUsersListProps) => {
  const {data: blockedUsersList, isLoading} = useGetBlockedUsersListQuery({
    page: 1,
    limit: 10,
  });

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <SettingHeader
          title="Blocked"
          onBackPress={() => navigation.goBack()}
        />
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <FlatList
            data={blockedUsersList?.data?.data || []}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 100}}
            ListEmptyComponent={<NodataFound />}
            renderItem={({item}) => <BlockUserListComp item={item} />}
          />
        )}
      </View>
    </View>
  );
};

export default BlockedUsersList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
    paddingHorizontal: 16,
  },
});
