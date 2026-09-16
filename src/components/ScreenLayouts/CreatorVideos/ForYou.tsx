import React, {useEffect, useMemo, useState} from 'react';
import ReelsFeed from '@components/VideosComponent/ReelsFeed';
import {
  useGetAllStreamsQuery,
  useGetSubscriptionsQuery,
  useWhatsHotQuery,
} from '@rtkServices/ShortsService';
import {
  DUMMY_FOR_YOU_REELS,
  extractList,
  mergeUniqueReels,
} from '@utils/dummyVideos';

const ForYou = ({isActive = true}: {isActive?: boolean}) => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const {data, isLoading, isFetching} = useGetAllStreamsQuery({
    page,
    limit: 10,
    type: 'all',
  });
  const {data: subscriptionsData} = useGetSubscriptionsQuery({
    page: 1,
    limit: 10,
  });
  const {data: hotsData} = useWhatsHotQuery({
    page: 1,
    limit: 10,
  });

  const pageStreamItems = useMemo(() => extractList(data), [data]);

  useEffect(() => {
    const nextItems = mergeUniqueReels([
      page === 1 ? extractList(subscriptionsData) : [],
      page === 1 ? extractList(hotsData) : [],
      pageStreamItems,
    ]);

    setItems(prev => {
      if (page === 1) {
        return nextItems.length > 0 ? nextItems : DUMMY_FOR_YOU_REELS;
      }
      const existing = new Set(prev.map(item => item._id));
      return [...prev, ...nextItems.filter(item => !existing.has(item._id))];
    });
  }, [page, pageStreamItems, subscriptionsData, hotsData]);

  const isUsingDummy = items[0]?._id?.startsWith?.('dummy-');

  return (
    <ReelsFeed
      items={items}
      isActive={isActive}
      isLoading={isLoading && items.length === 0}
      contentType="streams"
      onEndReached={() => {
        if (!isUsingDummy && !isFetching && pageStreamItems.length >= 10) {
          setPage(prev => prev + 1);
        }
      }}
    />
  );
};

export default ForYou;
