interface SearchResultData {
  shorts: shorts[];
  streams: any[];
  users: usersItem[];
}

interface shorts {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  category: string;
  commentsCount: number;
  createdAt: string;
  creatorId: string;
  duration: number;
  likesCount: number;
  sharesCount: number;
  tags: string[];
  updatedAt: string;
  viewsCount: number;
}


interface usersItem {
  _id: string;
  displayName: string;
  username: string;
  profilePicture: string;
  followersCount: number;
  verified: boolean;
  isLive: boolean;
}

interface SearchResultResponse {
  success: boolean;
  message: string;
  data: SearchResultData;
}

interface TrendingSearchResultData {
  keywords: string[];
  recentSearches: Array<RecentSearchItem>;
  streams: any[];
}


interface RecentSearchItem {
  count: number;
  keyword: string;
  userId: string;
  __v: number;
  _id: string;
}

interface TrendingSearchResultResponse {
  success: boolean;
  message: string;
  data: TrendingSearchResultData;
}

