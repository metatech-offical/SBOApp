import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {fonts} from '@constant/fontfamily';
import {RootState, useAppSelector} from '@store/index';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {ArrowDown} from '@assets/svg/AuthFlowIcons';
import CustomButton from '@components/CustomButtons/CustomButton';
import {
  useGetAllShortsFeedQuery,
  useGetAllStreamsQuery,
} from '@rtkServices/ShortsService';
import {PLAYLIST_TABS} from '@utils/data';
import {DeleteIcon} from '@assets/svg/ShortsIcon';
import {AddToPlaylistProps} from '@navigation/screens';
import SearchInputPlaylist from '@components/CustomInputs/SearchInputPlaylist';
import NodataFound from '@components/DataEmpty/NodataFound';
import ShorstCardPlayList from '@components/PlaylistComponent/ShorstCardPlayList';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import {
  useAddItemsToPlaylistMutation,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useRemoveItemsFromPlaylistMutation,
} from '@rtkServices/PlayListService';
import SelectableCard from '@components/PlaylistComponent/SelectableCard';
import {useToastMessage} from '@hooks/useToastMessage';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';

const AddToPlaylist = ({navigation, route}: AddToPlaylistProps) => {
  const {showError, showSuccess} = useToastMessage();
  const {playlistName, playlistId, existingItems = []} = route?.params || {};
  const [activeTab, setActiveTab] = useState('Videos');
  const {user} = useAppSelector((state: RootState) => state.user);

  const [searchedText, setSearchedText] = useState('');
  const [selectedItems, setSelectedItems] = useState<
    {contentId: string; contentType: 'shorts' | 'streams'}[]
  >([]);

  const [originalExistingItems, setOriginalExistingItems] = useState<
    {contentId: string; contentType: 'shorts' | 'streams'}[]
  >([]);

  const [removedItems, setRemovedItems] = useState<
    {contentId: string; contentType: 'shorts' | 'streams'}[]
  >([]);

  const {data: userShortsData} = useGetAllShortsFeedQuery({
    creatorId: user?._id ?? '',
  });
  const {data: userStreamData} = useGetAllStreamsQuery({
    page: 1,
    limit: 10,
    type: 'video',
    creatorId: user?._id ?? '',
  });

  const shorts = userShortsData?.data?.data ?? [];
  const [addToPlaylistReq, addPlayListRes] = useAddItemsToPlaylistMutation();
  const [removeFromPlaylistReq, removePlayListRes] =
    useRemoveItemsFromPlaylistMutation();
  const [createPlaylist, {isLoading: isCreating}] = useCreatePlaylistMutation();
  const [removeFromPlaylist] = useDeletePlaylistMutation();

  const handleSearch = async (query: string) => {};

  useEffect(() => {
    if (existingItems && existingItems?.length > 0) {
      const preSelectedItems = existingItems
        .map((item: any) => {
          const itemType = item?.content?.thumbnailUrl ? 'shorts' : 'streams';
          return {
            contentId: item?.content?._id || item?.content?.id,
            contentType: itemType,
          };
        })
        .filter((item: any) => item.contentId);

      setSelectedItems(preSelectedItems);
      setOriginalExistingItems([...preSelectedItems]);
    }
  }, [existingItems]);

  const isItemSelected = (itemId: string) => {
    return selectedItems.some(item => item.contentId === itemId);
  };

  const isExistingItem = (itemId: string) => {
    return originalExistingItems.some(item => item.contentId === itemId);
  };

  const toggleSelect = (itemId: string, itemType: 'shorts' | 'streams') => {
    const isSelected = selectedItems.some(item => item.contentId === itemId);
    const isExisting = isExistingItem(itemId);

    if (isSelected) {
      setSelectedItems(prev => prev.filter(item => item.contentId !== itemId));

      if (isExisting) {
        setRemovedItems(prev => [
          ...prev,
          {contentId: itemId, contentType: itemType},
        ]);
      }
    } else {
      setSelectedItems(prev => [
        ...prev,
        {contentId: itemId, contentType: itemType},
      ]);

      if (isExisting) {
        setRemovedItems(prev => prev.filter(item => item.contentId !== itemId));
      }
    }
  };

  const handleSavePlaylist = async () => {
    try {
      let finalPlaylistId = playlistId;
      let isNewlyCreated = false;

      // 1. Create playlist only if existingItems is empty (new playlist)
      if (existingItems.length === 0) {
        if (!playlistName?.trim()) {
          Alert.alert('Error', 'Please provide a playlist name.');
          return;
        }

        const createRes = await createPlaylist({
          title: playlistName.trim(),
          description: 'h',
        }).unwrap();
        finalPlaylistId = createRes?.data?._id;
        isNewlyCreated = true;
      }

      if (!finalPlaylistId) {
        Alert.alert('Error', 'Playlist creation failed.');
        return;
      }

      // 2. Remove items (if applicable)
      if (removedItems.length > 0) {
        for (const item of removedItems) {
          await removeFromPlaylistReq({
            playlistId: finalPlaylistId,
            contentId: item.contentId,
            contentType: item.contentType,
          }).unwrap();
        }
      }

      // 3. Add new items
      const newItemsToAdd = selectedItems.filter(
        item =>
          !originalExistingItems.some(o => o.contentId === item.contentId),
      );
      if (newItemsToAdd.length > 0) {
        const addRes = await addToPlaylistReq({
          playlistId: finalPlaylistId,
          items: newItemsToAdd,
        }).unwrap();

        if (addRes?.success) {
          showSuccess(addRes?.message || 'Playlist created successfully');
        } else {
          showError('Failed to create playlist');
        }
      }

      navigation.goBack();
      // refetch();
    } catch (error) {
      console.error('Error saving playlist:', JSON.stringify(error, null, 2));
      Alert.alert('Error', 'Failed to save playlist.');
    }
  };

  const getDataAndRenderItem = () => {
    switch (activeTab) {
      case 'Videos':
        return {
          data: userStreamData?.data?.data ?? [],
          renderItem: ({item}: any) => (
            <SelectableCard
              item={item}
              selected={isItemSelected(item._id)}
              onPress={() => toggleSelect(item._id, 'streams')}
            />
          ),
        };
      case 'VR':
        return {
          data: [],
          renderItem: ({item}: any) => (
            <Text style={{color: Colors.white}}></Text>
          ),
        };
      case 'Shorts':
        return {
          data: shorts,
          renderItem: ({item}: any) => (
            <ShorstCardPlayList
              data={item}
              selected={isItemSelected(item._id)}
              onPress={() => toggleSelect(item._id, 'shorts')}
            />
          ),
        };

      default:
        return {data: [], renderItem: () => null};
    }
  };
  const askDelete = () => {
    Alert.alert('Are you sure you want to delete this playlist?', '', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: () => deletePlayList(),
      },
    ]);
  };

  const deletePlayList = async () => {
    try {
      await removeFromPlaylist({
        playlistId: playlistId,
      }).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error('Failed to remove from playlist:', error);
      showError('Failed to remove from playlist');
    }
  };

  const {data, renderItem} = getDataAndRenderItem();

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        zIndex={0}
      />
      <StackHeader
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.headingContainer}>
        <View style={{rowGap: 3}}>
          <Text style={styles.headingText}>{`${playlistName}`}</Text>
          <Text style={styles.subHeading}>{`by ${
            user?.displayName || user?.username
          }`}</Text>
        </View>
        {existingItems.length > 0 && (
          <TouchableOpacity onPress={askDelete}>
            <DeleteIcon height={24} width={24} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.tabContainer}>
        {PLAYLIST_TABS?.map(tab => (
          <TouchableOpacity
            key={tab}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sercheader}>
        <SearchInputPlaylist
          value={searchedText}
          onChange={text => setSearchedText(text)}
          onIconPress={() => setSearchedText('')}
          onsubmitEditing={text => handleSearch(searchedText)}
          style={styles.searchcontainer}
          placeholder="Search..."
          containerStyle={styles.search}
        />
        <TouchableOpacity style={styles.timeContainer}>
          <Text style={styles.durationContainer}>Latest </Text>
          <ArrowDown color={'#ffffff'} height={20} width={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        key={activeTab}
        data={data}
        keyExtractor={item => item._id || item.id}
        renderItem={renderItem}
        numColumns={activeTab === 'Shorts' ? 3 : 1}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NodataFound />}
      />
      {(selectedItems?.length > 0 || removedItems?.length > 0) && (
        <View style={styles.bottomButtonsContainer}>
          <CustomButton
            text="Cancel"
            onPress={() => {
              setSelectedItems([...originalExistingItems]);
              setRemovedItems([]);
            }}
            textStyle={{
              textTransform: 'capitalize',
            }}
            isLoading={false}
            btnStyle={{
              width: '30%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <CustomButton
            text="+ Save playlist"
            onPress={handleSavePlaylist}
            textStyle={styles.text}
            isLoading={
              isCreating ||
              addPlayListRes.isLoading ||
              removePlayListRes.isLoading
            }
            btnStyle={{
              width: '65%',
              backgroundColor: '#ffffff',
            }}
          />
        </View>
      )}
    </View>
  );
};

export default AddToPlaylist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  tabButton: {
    alignItems: 'center',
    paddingTop: 15,
    flex: 1,
  },
  tabText: {
    color: Colors.grey,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
  },
  activeTabText: {
    color: '#ffffff',
  },
  activeIndicator: {
    marginTop: 4,
    height: 2,
    width: '60%',
    backgroundColor: '#8800FF',
  },
  listContent: {
    flexGrow: 1,
    padding: 4,
    backgroundColor: 'transparent',
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 5,
    rowGap: 5,
  },
  headingText: {
    fontSize: fontSize.f16,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  subHeading: {
    color: '#B1B0B0',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.black,
    columnGap: 10,
    paddingHorizontal: 10,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },

  saveButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },
  buttonText2: {
    color: '#ffffff',
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },
  sercheader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: 'transparent',
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
  text: {
    textTransform: 'capitalize',
    color: Colors.black,
  },
});
