import CustomCarosal from '@components/VideosComponent/CustomCarosal';
import {fonts} from '@constant/fontfamily';
import React from 'react';
import {View, Text, StyleSheet, FlatList, ScrollView} from 'react-native';
import SubscriptionCard from '@components/VideosComponent/SubscriptionCard';
import {
  useGetAllStreamsQuery,
  useGetSubscriptionsQuery,
  useWhatsHotQuery,
} from '@rtkServices/ShortsService';
import {useNavigation} from '@react-navigation/native';
import {FireIcon} from '@assets/svg/HomeScreenIcon';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';

const ForYou = () => {
  const navigation = useNavigation();
  const {data} = useGetSubscriptionsQuery({});

  const {data: HotsData} = useWhatsHotQuery({
    page: 1,
    limit: 10,
  });
  const {data: CarouselData} = useGetAllStreamsQuery({
    page: 1,
    limit: 10,
    type: 'all',
  });

  const SubscriptionData = data?.data?.data || [];

  const finalDataConcise = HotsData?.data?.filter(
    item => item?.isLive || item?.videoUrl?.trim(),
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 100}}>
      {CarouselData?.data?.data && CarouselData?.data?.data?.length > 0 && (
        <CustomCarosal CarouselData={CarouselData} />
      )}
      {SubscriptionData?.length > 0 || HotsData?.data?.length > 0 ? (
        <>
          {SubscriptionData?.length > 0 && (
            <View style={styles.sbscriptionContainers}>
              <View style={styles.forRow}>
                <Text style={styles.heading}>Subscriptions</Text>
                {/* <RightArrowIcon fill={'#ffffff'} height={20} width={20} /> */}
              </View>
              <View style={styles.mainContainer}>
                <FlatList
                  data={SubscriptionData}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => (
                    <SubscriptionCard
                      thumbnail={item?.thumbnailUrl || ''}
                      userName={item?.username || ''}
                      title={item?.title || ''}
                      views={item?.viewsCount || 0}
                      onPress={() => {
                        navigation.navigate('NormalPlayer' as never, {
                          streamId: item?._id,
                        });
                      }}
                    />
                  )}
                  contentContainerStyle={{paddingLeft: 8, paddingRight: 8}}
                />
              </View>
            </View>
          )}
          {HotsData?.data?.length > 0 && (
            <View style={styles.sbscriptionContainers}>
              <View style={styles.forRow2}>
                <Text style={styles.heading}>What's Hot</Text>
                <FireIcon fill={'#ffffff'} height={20} width={20} />
              </View>
              <View style={styles.mainContainer}>
                <FlatList
                  data={finalDataConcise}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => (
                    <SubscriptionCard
                      thumbnail={item?.thumbnailUrl || ''}
                      userName={item.username || ''}
                      title={item?.title || ''}
                      views={item?.viewsCount || 0}
                      onPress={() => {
                        navigation.navigate('NormalPlayer' as never, {
                          streamId: item?._id,
                        });
                      }}
                    />
                  )}
                  contentContainerStyle={{paddingLeft: 8, paddingRight: 8}}
                />
              </View>
            </View>
          )}
        </>
      ) : (
        <></>
      )}
    </ScrollView>
  );
};

export default ForYou;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  sbscriptionContainers: {
    flex: 1,
  },
  forRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 26,
    paddingBottom: 10,
  },
  forRow2: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 26,
    paddingBottom: 10,
    columnGap: 10,
  },
  heading: {
    fontFamily: fonts['Poppins-SemiBold'],
    fontSize: fontSize.f16,
    color: Colors.white,
  },
  mainContainer: {},
});
