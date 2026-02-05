import {fonts} from '@constant/fontfamily';
import React, {useCallback, useRef, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import LiveVideoCard from '@components/VideosComponent/LiveVideoCard';
import {useGetAllLiveStreamsQuery} from '@rtkServices/LiveStreamServices';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import {Stream} from '@rtkServices/LiveStreamServices/LiveServices';
import NodataFound from '@components/DataEmpty/NodataFound';
import {
  useFollowUnfollowUserMutation,
  useNotInterestedMutation,
  useReportContentMutation,
} from '@rtkServices/ContentActionService';
import {useNavigation} from '@react-navigation/native';
import CustomBottomSheet from '@components/CustomBottomSheet/CustomBottomSheet';
import FastImage from 'react-native-fast-image';
import {LiveSheetData, REPORT_DATA} from '@utils/data';
import {Colors} from '@constant/colors';
import CustomRadioButton from '@components/CustomRadioButton/CustomRadioButton';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import {useToastMessage} from '@hooks/useToastMessage';
import { fontSize } from '@constant/fontSize';

const LiveVideosScreen = () => {
  const {showError, showSuccess} = useToastMessage();
  const sheetRef = useRef(null);
  const streamIdRef = useRef<string>('');
  const navigation = useNavigation();

  const [page, setPage] = useState(1);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isOpenSheet, setIsOpenSheet] = useState(false);
  const [followAndUnfollow] = useFollowUnfollowUserMutation();
  const [reportUser] = useReportContentMutation();
  const [notIntrestReq] = useNotInterestedMutation();

  const [selectedFilter, setSelectedFilter] = useState('');
  const [isOpenSheet1, setIsOpenSheet1] = useState(false);
  const {data, isFetching, refetch} = useGetAllLiveStreamsQuery({
    page: page,
    limit: 10,
  });

  React.useEffect(() => {
    if (data?.data?.streams) {
      if (page === 1) {
        setStreams(data.data.streams);
      } else {
        setStreams(prev => [...prev, ...data.data.streams]);
      }
    }
  }, [data, page]);

  const handleRefresh = async () => {
    setPage(1);
    await refetch();
  };
  const handleLoadMore = () => {
    if (
      !isFetching &&
      data?.data?.streams?.length &&
      streams.length < (data?.data?.totalCount || 0)
    ) {
      setPage(prev => prev + 1);
    }
  };
  const handleFollow = async (id: string) => {
    try {
      const payload = {targetUserId: id};
      await followAndUnfollow(payload).then((res: any) => {
        if (res?.error) {
          showError(
            res?.error?.data?.message
              ? res?.error?.data?.message
              : res?.error?.data,
          );
        }
      });
    } catch (error) {
      console.log('error', error);
    }
  };
  const handleSubmit = (item: any) => {
    if (item?.id == 1) {
      setIsOpenSheet1(true);
    } else if (item?.id == 2) {
      notIntrested();
    }
  };
  const RenderSheet = () => {
    return (
      <View style={styles.sheetContainer}>
        <FlatList
          data={LiveSheetData}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <Pressable
              onPress={() => {
                handleSubmit(item);
              }}
              style={styles.sheetItem}>
              <FastImage source={item.image} style={styles.sheetItemImage} />
              <Text style={styles.sheetItemText}>{item.name}</Text>
            </Pressable>
          )}
          keyExtractor={item => item?.id?.toString()}
        />
      </View>
    );
  };
  const RenderReportSheet = useCallback(
    () => (
      <View style={styles.sheetContent}>
        <CustomRadioButton
          data={REPORT_DATA}
          selectedFilter={selectedFilter?.value}
          onPress={(item: any) => {
            setSelectedFilter(item);
          }}
          customTitleStyle={{}}
        />
      </View>
    ),
    [selectedFilter, styles.sheetContent],
  );

  const reportSubmit = async (reason: any) => {
    const contentId = streamIdRef.current;
    const reasonLabel = reason?.label;
    if (!reasonLabel) {
      showError('Reason is missing.');
      return;
    }
    const body = {
      contentId: contentId,
      reason: reasonLabel,
      contentType: 'streams',
      description: 'test',
    };
    await reportUser(body).then(res => {
      if (res?.data) {
        setIsOpenSheet(false);
        setIsOpenSheet1(false);
        showSuccess(res?.data?.message || '');
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Somthing went wrong');
        setIsOpenSheet(false);
        setIsOpenSheet1(false);
      }
    });
  };

  const notIntrested = async () => {
    const contentId = streamIdRef.current;
    const body = {
      contentId: contentId,
      contentType: 'streams',
    };
    await notIntrestReq(body).then(res => {
      if (res?.data) {
        setIsOpenSheet(false);
        showSuccess(res?.data?.message || '');
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Somthing went wrong');
        setIsOpenSheet(false);
      }
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <FlatList
          data={data?.data?.streams || []}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NodataFound />}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => (
            <LiveVideoCard
              item={item}
              handleFollow={() => {
                handleFollow(item?.creator?._id);
              }}
              navigation={navigation}
              isOptionPress={() => {
                streamIdRef.current = item?._id;
                setIsOpenSheet(true);
              }}
            />
          )}
          refreshControl={
            <CustomRefreshControler
              refreshing={isFetching}
              onRefresh={handleRefresh}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      </View>
      {isOpenSheet && (
        <CustomBottomSheet
          label={''}
          ref={sheetRef}
          index={3}
          renderView={RenderSheet}
          onClose={() => setIsOpenSheet(false)}
          onPress={() => setIsOpenSheet(false)}
        />
      )}
      {isOpenSheet1 && (
        <CustomBottomSheet
          label={'Report Problem'}
          ref={sheetRef}
          index={4}
          renderView={RenderReportSheet}
          onClose={() => setIsOpenSheet1(false)}
          onPress={() => setIsOpenSheet1(false)}
          onSubmit={() => {
            reportSubmit(selectedFilter);
          }}
        />
      )}
    </View>
  );
};

export default LiveVideosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  forRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 26,
    paddingBottom: 10,
  },
  heading: {
    fontFamily: fonts['Poppins-SemiBold'],
    fontSize: fontSize.f16,
    color: Colors.white,
  },
  mainContainer: {},
  sheetContainer: {
    marginTop: 20,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  sheetItemImage: {
    width: 25,
    height: 25,
    marginRight: 20,
  },
  sheetItemText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  sheetContent: {
    height: SCREEN_HEIGHT * 0.45,
    maxHeight: SCREEN_HEIGHT * 0.8,
    minHeight: SCREEN_HEIGHT * 0.3,
    paddingHorizontal: 10,
    zIndex: 7,
    alignContent: 'flex-end',
  },
});
