import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {fonts} from '@constant/fontfamily';
import {debounce} from 'lodash';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import CustomBottomSheet from '@components/CustomBottomSheet/CustomBottomSheet';
import CustomRadioButton from '@components/CustomRadioButton/CustomRadioButton';
import {REPORT_DATA} from '@utils/data';
import {useGetOrSearchPlaylistQuery} from '@rtkServices/PlayListService';
import {RootState, useAppSelector} from '@store/index';
import {ArrowDown} from '@assets/svg/AuthFlowIcons';
import {PlusIcon} from '@assets/svg/CommonIcons';
import CustomButton from '@components/CustomButtons/CustomButton';
import NodataFound from '@components/DataEmpty/NodataFound';
import SearchInputPlaylist from '@components/CustomInputs/SearchInputPlaylist';
import LinearGradient from 'react-native-linear-gradient';
import PlayListScreen from '@components/PlaylistComponent/PlayListScreen';
import {useReportContentMutation} from '@rtkServices/ContentActionService';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';
import {fontSize, height} from '@constant/fontSize';

const PlaylistProfileTab = ({userId}: {userId?: string}) => {
  const {showError, showSuccess} = useToastMessage();
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [searchedText, setSearchedText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [reportedVideo, setReportedVideo] = useState(null);
  const sheetRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState<any>('');
  const {user} = useAppSelector((state: RootState) => state.user);
  const [reportUser] = useReportContentMutation();

  const queryParams = useMemo(
    () => ({
      creatorId: userId ?? '',
      pageNumber: pageNumber,
      pageLimit: 20,
      keyword: searchedText.trim(),
    }),
    [userId, pageNumber, searchedText],
  );

  const {
    data: playlistData,
    refetch: refetchPlaylists,
    isFetching,
  } = useGetOrSearchPlaylistQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    skip: !userId,
  });

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        if (isActive && userId) {
          try {
            await refetchPlaylists();
          } catch (error) {
            console.log('Error refetching playlists:', error);
          }
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [refetchPlaylists, userId]),
  );

  const playlists = playlistData?.data?.playlists || [];

  useEffect(() => {
    setPageNumber(1);
  }, [searchedText]);

  const openCreatePlaylistModal = () => {
    setModalVisible(true);
  };

  const closeCreatePlaylistModal = () => {
    setModalVisible(false);
  };

  const handleNext = () => {
    if (!playlistName.trim()) {
      return;
    }
    closeCreatePlaylistModal();
    navigation.navigate('AddToPlaylist', {playlistName});
    setPlaylistName('');
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.length === 0 && userId) {
        try {
          refetchPlaylists();
        } catch (error) {
          console.log('Error in debounced search:', error);
        }
      }
    }, 1500),
    [refetchPlaylists, userId],
  );

  useEffect(() => {
    debouncedSearch(searchedText);
  }, [searchedText, debouncedSearch]);

  const loadMoreResults = () => {
    if (
      !isFetchingMore &&
      !isFetching &&
      playlistData?.pagination?.currentPage <
        playlistData?.pagination?.totalPages
    ) {
      setIsFetchingMore(true);
      setPageNumber(prevPage => prevPage + 1);
      setTimeout(() => setIsFetchingMore(false), 1000);
    }
  };

  const handleVideoReport = (videoData: any) => {
    setReportedVideo(videoData);
  };

  const handleReportPress = async () => {
    if (selectedFilter && selectedFilter.label) {
      try {
        const payload = {
          contentId: reportedVideo?.id,
          contentType: reportedVideo?.type,
          reason: selectedFilter.label,
          description: 'test',
        };
        await reportUser(payload).then(res => {
          if (res?.data) {
            setReportedVideo(null);
            showSuccess(res?.data?.message || '');
          }
          if (res?.error) {
            showError(res?.error?.data?.message || 'Somthing went wrong');
            setReportedVideo(null);
          }
        });
      } catch (error) {
        console.error('Failed to report playlist:', error);
      }
    } else {
      console.log('No report title selected');
      showError('Please select a report title');
    }
  };

  const RenderReportSheet = useCallback(
    () => (
      <View style={styles.sheetContent}>
        <CustomRadioButton
          data={REPORT_DATA}
          selectedFilter={selectedFilter?.value}
          onPress={(item: any) => setSelectedFilter(item)}
          customTitleStyle={{}}
        />
      </View>
    ),
    [selectedFilter, styles.sheetContent],
  );

  return (
    <View style={styles.container}>
      <View style={styles.sercheader}>
        <SearchInputPlaylist
          value={searchedText}
          onChange={text => setSearchedText(text)}
          onIconPress={() => setSearchedText('')}
          onsubmitEditing={text => setSearchedText(text)}
          style={styles.searchcontainer}
          placeholder="Search for playlists"
          containerStyle={styles.search}
        />
        <TouchableOpacity style={styles.timeContainer}>
          <Text style={styles.durationContainer}>Latest </Text>
          <ArrowDown color={'#ffffff'} height={20} width={20} />
        </TouchableOpacity>

        {userId === user?._id && (
          <Pressable
            style={{
              height: 24,
              width: 24,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 15,
              marginLeft: 10,
            }}
            onPress={openCreatePlaylistModal}>
            <PlusIcon
              fill={Colors.black}
              stroke={Colors.black}
              height={12}
              width={12}
            />
          </Pressable>
        )}
      </View>
      <FlatList
        nestedScrollEnabled={true}
        data={playlists}
        renderItem={({item}) => (
          <PlayListScreen
            playlist={item}
            onUpdateSuccess={refetchPlaylists}
            // refetch={refetch}
            onReportVideo={handleVideoReport}
          />
        )}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreResults}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          isFetching ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : userId === user?._id ? (
            <View style={styles.addContainer}>
              <Text style={styles.CteatTitle}>
                You have no playlists yet, {'\n'}
                Create one
              </Text>
              <CustomButton
                onPress={openCreatePlaylistModal}
                isLoading={false}
                text="Create"
                iconRight={
                  <PlusIcon height={15} width={15} style={{marginLeft: 6}} />
                }
                btnStyle={styles.addButton}
                textStyle={styles.addButtonText}
              />
            </View>
          ) : (
            <NodataFound />
          )
        }
      />

      {reportedVideo && (
        <CustomBottomSheet
          label={'Report Problem'}
          ref={sheetRef}
          index={5}
          renderView={RenderReportSheet}
          onClose={() => {
            setReportedVideo(null);
          }}
          onPress={() => setReportedVideo(null)}
          onSubmit={handleReportPress}
        />
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeCreatePlaylistModal}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={[
              'rgba(26, 214, 85, 0.2)',
              'rgba(136, 0, 255, 0.2)',
              'rgba(26, 10, 71, 0.2)',
            ]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={StyleSheet.absoluteFillObject}></LinearGradient>
          <View style={styles.modalInerView}>
            <TextInput
              value={playlistName}
              onChangeText={setPlaylistName}
              placeholder="Playlist name"
              placeholderTextColor={'#B1B0B0'}
              style={styles.inputStyle}
              maxLength={30}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Pressable onPress={closeCreatePlaylistModal}>
                <Text style={styles.cancelStyle}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleNext}>
                <Text style={styles.nextStyle}>Next</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchcontainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 45,
    shadowOpacity: 0,
    width: '65%',
    marginRight: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  sercheader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    width: '100%',
  },
  addButton: {
    width: '25%',
    height: 40,
    backgroundColor: 'rgba(182, 182, 182, 0.4)',
    borderRadius: 15,
  },
  addContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 20,
  },
  addButtonText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  CteatTitle: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#ffffff',
    textAlign: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 10,
  },
  durationContainer: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: '#ffffff',
    marginRight: 5,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '70%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInerView: {
    width: '80%',
    backgroundColor: 'rgba(72, 71, 71, 1)',
    padding: 20,
    borderRadius: 20,
  },
  inputStyle: {
    fontSize: fontSize.f14,
    color: '#ffffff',
    marginBottom: 20,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  nextStyle: {
    color: '#2DA7FF',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
  },
  cancelStyle: {
    color: '#ffffff',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
  },
  reportNotification: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  reportText: {
    color: Colors.white,
    fontSize: fontSize.f12,
  },
  sheetContent: {
    height: height * 0.7,
    maxHeight: height * 0.9,
    minHeight: height * 0.6,
    zIndex: 99,
    alignContent: 'flex-start',
  },
});

export default PlaylistProfileTab;
