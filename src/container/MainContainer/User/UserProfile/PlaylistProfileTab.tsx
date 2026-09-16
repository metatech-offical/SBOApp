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
import {SearchIcon, ChevronDownSmallIcon} from '@assets/svg/HomeScreenIcon';
import CustomButton from '@components/CustomButtons/CustomButton';
import NodataFound from '@components/DataEmpty/NodataFound';
import SearchInputPlaylist from '@components/CustomInputs/SearchInputPlaylist';
import LinearGradient from 'react-native-linear-gradient';
import PlayListScreen from '@components/PlaylistComponent/PlayListScreen';
import {useReportContentMutation} from '@rtkServices/ContentActionService';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';
import {fontSize, height} from '@constant/fontSize';
import {DUMMY_PROFILE_PLAYLISTS} from '@utils/dummyVideos';

const PlaylistProfileTab = ({
  userId,
  embedded,
  useDummyFallback,
}: {
  userId?: string;
  embedded?: boolean;
  useDummyFallback?: boolean;
}) => {
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
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [sortOpen, setSortOpen] = useState(false);
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

  const apiPlaylists = playlistData?.data?.playlists || [];
  const playlists = useMemo(() => {
    const source =
      apiPlaylists.length > 0
        ? apiPlaylists
        : useDummyFallback
          ? DUMMY_PROFILE_PLAYLISTS
          : [];
    const query = searchedText.trim().toLowerCase();
    const filtered = source.filter((item: any) =>
      query ? `${item?.title || ''}`.toLowerCase().includes(query) : true,
    );
    return [...filtered].sort((a: any, b: any) => {
      if (sortBy === 'popular') {
        return (b?.videosCount || 0) - (a?.videosCount || 0);
      }
      return (
        new Date(b?.createdAt || 0).getTime() -
        new Date(a?.createdAt || 0).getTime()
      );
    });
  }, [apiPlaylists, searchedText, sortBy, useDummyFallback]);

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
    <View style={[styles.container, embedded && styles.embedded]}>
      {embedded ? (
        <View style={styles.toolbarWrap}>
          <View style={styles.toolbar}>
            <View style={styles.profileSearch}>
              <SearchIcon width={14} height={14} stroke="#FFFFFF" />
              <TextInput
                value={searchedText}
                onChangeText={setSearchedText}
                placeholder="Search"
                placeholderTextColor="rgba(255, 255, 255, 0.46)"
                style={styles.profileSearchInput}
                allowFontScaling={false}
              />
            </View>
            <Pressable
              style={styles.sortButton}
              onPress={() => setSortOpen(open => !open)}>
              <Text style={styles.sortLabel}>Sort by</Text>
              <View style={sortOpen ? styles.chevronUp : undefined}>
                <ChevronDownSmallIcon width={7} height={3} stroke="#FFFFFF" />
              </View>
            </Pressable>
            {userId === user?._id && (
              <Pressable
                style={styles.createButton}
                onPress={openCreatePlaylistModal}>
                <PlusIcon fill="#111111" height={12} width={12} />
              </Pressable>
            )}
          </View>
          {sortOpen && (
            <View style={styles.sortMenu}>
              <Pressable
                style={styles.sortOption}
                onPress={() => {
                  setSortBy('latest');
                  setSortOpen(false);
                }}>
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === 'latest' && styles.sortOptionActive,
                  ]}>
                  Latest
                </Text>
              </Pressable>
              <Pressable
                style={styles.sortOption}
                onPress={() => {
                  setSortBy('popular');
                  setSortOpen(false);
                }}>
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === 'popular' && styles.sortOptionActive,
                  ]}>
                  Popular
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
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
      )}
      <FlatList
        nestedScrollEnabled={true}
        scrollEnabled={!embedded}
        data={playlists}
        renderItem={({item}) => (
          <PlayListScreen
            playlist={item}
            onUpdateSuccess={refetchPlaylists}
            onReportVideo={handleVideoReport}
            embedded={embedded}
          />
        )}
        ItemSeparatorComponent={
          embedded ? () => <View style={styles.separator} /> : undefined
        }
        contentContainerStyle={embedded ? styles.profileList : undefined}
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
            <NodataFound compact={embedded} />
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
  embedded: {
    flex: 0,
  },
  toolbarWrap: {
    zIndex: 4,
    marginBottom: 16,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    height: 41,
  },
  profileSearch: {
    flex: 1,
    height: 41,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 12,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
  },
  profileSearchInput: {
    flex: 1,
    padding: 0,
    fontSize: 13,
    lineHeight: 17,
    fontFamily: fonts['Poppins-Regular'],
    color: '#FFFFFF',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 17,
  },
  sortLabel: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: fonts['Poppins-Medium'],
    color: '#FFFFFF',
    textAlign: 'center',
  },
  chevronUp: {
    transform: [{rotate: '180deg'}],
  },
  sortMenu: {
    position: 'absolute',
    top: 45,
    right: 40,
    minWidth: 110,
    backgroundColor: 'rgba(20, 20, 20, 0.96)',
    borderRadius: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortOptionText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255, 255, 255, 0.7)',
  },
  sortOptionActive: {
    color: '#FFFFFF',
    fontFamily: fonts['Poppins-Medium'],
  },
  createButton: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  profileList: {
    paddingBottom: 26,
  },
  separator: {
    height: 12,
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
