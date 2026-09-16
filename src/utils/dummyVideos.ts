const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
];

const SAMPLE_THUMBS = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'https://images.unsplash.com/photo-1501281668745-f7f9d5265ec1?w=800',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
];

const CREATORS = [
  {username: 'NovaBeats', displayName: 'Nova Beats'},
  {username: 'StageLight', displayName: 'Stage Light'},
  {username: 'Rimelive', displayName: 'Rime Live'},
  {username: 'EchoRoom', displayName: 'Echo Room'},
  {username: 'PulseClub', displayName: 'Pulse Club'},
  {username: 'VinylYard', displayName: 'Vinyl Yard'},
];

const TITLES = [
  'Late night session with the crew',
  'Unplugged studio set',
  'City lights concert highlights',
  'After hours mix',
  'Behind the stage walkthrough',
  'Weekend warmup clips',
];

const TAG_SETS = [
  ['For you', 'Music', 'Live', 'Pop'],
  ['Comedy', 'Music', 'Show', 'DJ'],
  ['Concert', 'Live', 'Rock'],
  ['Studio', 'Music', 'New'],
];

const buildReel = (prefix: string, index: number) => {
  const creator = CREATORS[index % CREATORS.length];
  return {
    _id: `${prefix}-${index + 1}`,
    videoUrl: SAMPLE_VIDEOS[index % SAMPLE_VIDEOS.length],
    thumbnailUrl: SAMPLE_THUMBS[index % SAMPLE_THUMBS.length],
    title: TITLES[index % TITLES.length],
    description: TITLES[index % TITLES.length],
    likesCount: 1200 + index * 84,
    commentsCount: 40 + index * 7,
    commentCount: 40 + index * 7,
    shares: 12 + index,
    isLiked: false,
    isSaved: false,
    isFollowing: false,
    duration: 18 + index * 6,
    tags: TAG_SETS[index % TAG_SETS.length],
    createdAt: new Date(Date.now() - (index + 1) * 1000 * 60 * 47).toISOString(),
    creator: {
      _id: `${prefix}-creator-${index + 1}`,
      username: creator.username,
      displayName: creator.displayName,
      profilePicture: SAMPLE_THUMBS[index % SAMPLE_THUMBS.length],
    },
  };
};

export const DUMMY_FOR_YOU_REELS = Array.from({length: 6}, (_, index) =>
  buildReel('dummy-foryou', index),
);

export const DUMMY_SHORTS_REELS = Array.from({length: 6}, (_, index) =>
  buildReel('dummy-short', index),
);

export const DUMMY_LIVE_STREAMS = Array.from({length: 6}, (_, index) => {
  const reel = buildReel('dummy-live-stream', index);
  return {
    ...reel,
    transcodedUrl: reel.videoUrl,
    type: 'live',
    status: 'live',
    settings: {visibility: 'everyone'},
    isLive: true,
    isVR: index === 2,
    vodStatus: 'none',
    creatorId: reel.creator._id,
    category: 'Music',
    isDeleted: false,
    viewsCount: 1800 + index * 240,
    sharesCount: 18 + index,
    roomId: `dummy-room-${index + 1}`,
    token: '',
    updatedAt: reel.createdAt,
    __v: 0,
    isLiked: false,
    isFollowing: index % 2 === 0,
  };
});

const RECENT_KEYWORDS = [
  'Nova Beats',
  'live music',
  'unplugged set',
  'weekend warmup',
];

export const DUMMY_RECENT_SEARCHES: RecentSearchItem[] = RECENT_KEYWORDS.map(
  (keyword, index) => ({
    _id: `dummy-search-${index + 1}`,
    keyword,
    userId: 'dummy-user',
    count: 4 - index,
    __v: 0,
  }),
);

export const DUMMY_TRENDING_STREAMS = DUMMY_LIVE_STREAMS.map((item, index) => ({
  ...item,
  isLive: index % 2 === 0,
  viewsCount: item.viewsCount,
}));

export const DUMMY_SEARCH_USERS: usersItem[] = CREATORS.map((creator, index) => ({
  _id: `dummy-search-user-${index + 1}`,
  displayName: creator.displayName,
  username: creator.username,
  profilePicture: SAMPLE_THUMBS[index % SAMPLE_THUMBS.length],
  followersCount: 1840 + index * 260,
  verified: index % 2 === 0,
  isLive: index % 3 === 0,
}));

const matchesQuery = (query: string, values: Array<string | undefined>) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }
  return values.some(value => value?.toLowerCase().includes(normalized));
};

export const getDummySearchResults = (search = ''): SearchResultData => {
  const streams = DUMMY_TRENDING_STREAMS.filter(item =>
    matchesQuery(search, [
      item.title,
      item.description,
      item.creator?.username,
      item.creator?.displayName,
    ]),
  );
  const shorts = DUMMY_SHORTS_REELS.filter(item =>
    matchesQuery(search, [
      item.title,
      item.description,
      item.creator?.username,
      item.creator?.displayName,
    ]),
  ) as unknown as shorts[];
  const users = DUMMY_SEARCH_USERS.filter(item =>
    matchesQuery(search, [item.username, item.displayName]),
  );

  if (streams.length || shorts.length || users.length) {
    return {streams, shorts, users};
  }

  return {
    streams: DUMMY_TRENDING_STREAMS,
    shorts: DUMMY_SHORTS_REELS as unknown as shorts[],
    users: DUMMY_SEARCH_USERS,
  };
};

export const withDummySearchData = (
  api?: SearchResultData | null,
  search = '',
): SearchResultData => {
  const hasApi = Boolean(
    api?.streams?.length || api?.shorts?.length || api?.users?.length,
  );
  return hasApi && api ? api : getDummySearchResults(search);
};

export const getDummyStreamById = (id?: string) =>
  [...DUMMY_LIVE_STREAMS, ...DUMMY_FOR_YOU_REELS, ...DUMMY_SHORTS_REELS].find(
    item => item._id === id,
  );

export const isDummyReelId = (id?: string) =>
  typeof id === 'string' && id.startsWith('dummy-');

export const extractList = (payload: any): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }
  if (Array.isArray(payload?.data?.streams)) {
    return payload.data.streams;
  }
  if (Array.isArray(payload?.data?.shorts)) {
    return payload.data.shorts;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  return [];
};

export const toReelItem = (item: any) => ({
  ...item,
  _id: item?._id || item?.id,
  videoUrl: item?.videoUrl || item?.streamUrl || '',
  description: item?.description || item?.title || '',
  commentsCount: item?.commentsCount ?? item?.commentCount ?? 0,
  commentCount: item?.commentCount ?? item?.commentsCount ?? 0,
  likesCount: item?.likesCount ?? 0,
  duration: item?.duration ?? item?.videoDuration ?? 0,
  tags: item?.tags || [],
  createdAt: item?.createdAt,
  creator: item?.creator || {
    _id: item?.creatorId?._id || item?.creatorId,
    username:
      item?.username ||
      item?.userName ||
      item?.creatorId?.username ||
      item?.creatorId?.displayName,
    displayName:
      item?.displayName ||
      item?.creatorId?.displayName ||
      item?.username ||
      item?.userName,
    profilePicture:
      item?.profilePicture ||
      item?.creatorId?.profilePicture ||
      item?.thumbnailUrl,
  },
});

const buildProfileHomeCard = (id: string, thumbIndex: number) => ({
  _id: id,
  thumbnailUrl: SAMPLE_THUMBS[thumbIndex % SAMPLE_THUMBS.length],
  title: 'Guided with Wim Hof',
  description: 'SBO is all set to revolutionize the creator economy',
  viewsCount: 22500,
  type: 'videos',
  status: 'published',
  isLive: false,
  settings: {visibility: 'everyone'},
  videoUrl: SAMPLE_VIDEOS[thumbIndex % SAMPLE_VIDEOS.length],
});

export const DUMMY_PROFILE_LATEST = [
  buildProfileHomeCard('dummy-profile-latest-1', 0),
  buildProfileHomeCard('dummy-profile-latest-2', 1),
  buildProfileHomeCard('dummy-profile-latest-3', 2),
];

export const DUMMY_PROFILE_POPULAR = [
  buildProfileHomeCard('dummy-profile-popular-1', 3),
  buildProfileHomeCard('dummy-profile-popular-2', 4),
  buildProfileHomeCard('dummy-profile-popular-3', 5),
];

const PROFILE_VIDEO_TITLES = [
  'Echoes of Nature: A Symphony of Forest Sounds',
  'VALORANT FOR 65 HOURS: The Film | Solo Iron-Radiant in One Stream Challenge',
  'Martix Garret Live @ Ultra music festival Maimi',
  'Late night session with the crew',
  'City lights concert highlights',
  'Unplugged studio set',
];

export const DUMMY_PROFILE_VIDEOS = PROFILE_VIDEO_TITLES.map((title, index) => ({
  ...buildProfileHomeCard(`dummy-profile-video-${index + 1}`, index),
  title,
  description: 'SBO is all set to revolutionize the creator economy',
  viewsCount: 22500 + index * 1400,
  duration: 5700,
  createdAt: new Date(
    Date.now() - (index + 1) * 1000 * 60 * 60 * 24 * 30,
  ).toISOString(),
  tags: index % 2 === 1 ? TAG_SETS[index % TAG_SETS.length] : [],
}));

const PROFILE_SHORT_DURATIONS = [30, 30, 30, 30, 30, 30, 1020, 1020, 6720];

export const DUMMY_PROFILE_SHORTS = Array.from({length: 9}, (_, index) => ({
  ...buildReel('dummy-profile-short', index),
  duration: PROFILE_SHORT_DURATIONS[index],
  settings: {visibility: 'everyone'},
}));

export const DUMMY_PROFILE_PLAYLISTS = [
  {
    _id: 'dummy-playlist-1',
    title: 'Late night sessions',
    thumbnailUrl: SAMPLE_THUMBS[0],
    videosCount: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    _id: 'dummy-playlist-2',
    title: 'Festival highlights',
    thumbnailUrl: SAMPLE_THUMBS[1],
    videosCount: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
  },
  {
    _id: 'dummy-playlist-3',
    title: 'Studio cuts',
    thumbnailUrl: SAMPLE_THUMBS[2],
    videosCount: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 70).toISOString(),
  },
];

export const mergeUniqueReels = (lists: any[][], requireVideo = true) => {
  const seen = new Set<string>();
  const items: any[] = [];
  lists.forEach(list => {
    list.forEach(item => {
      const reel = toReelItem(item);
      if (!reel?._id || seen.has(reel._id)) {
        return;
      }
      if (requireVideo && !reel.videoUrl?.trim?.()) {
        return;
      }
      if (!requireVideo && !reel.videoUrl?.trim?.() && !reel.thumbnailUrl) {
        return;
      }
      seen.add(reel._id);
      items.push(reel);
    });
  });
  return items;
};
