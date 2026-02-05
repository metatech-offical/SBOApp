export interface StreamSettings {
  visibility: 'everyone' | 'followers' | 'subscribers' | 'none' | string;
}

export interface StreamCreator {
  _id: string;
  username: string;
  displayName: string;
  profilePicture: string;
}

export interface Stream {
  _id: string;
  videoUrl: string;
  transcodedUrl: string;
  type: string;
  status: string;
  title: string;
  settings: StreamSettings;
  isLive: boolean;
  vodStatus: string;
  creatorId: string;
  description: string;
  category: string;
  tags: string[];
  isDeleted: boolean;
  thumbnailUrl: string;
  duration: number;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  sharesCount: number;
  roomId: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  creator: StreamCreator;
  isLiked: boolean;
}

export interface GetAllStreamsResponse {
  success: boolean;
  message: string;
  data: {
    totalCount: number;
    page: number;
    limit: number;
    streams: Stream[];
  };
}

export interface StreamResponse {
  success: boolean;
  message: string;
  data: StreamDetails;
}

export interface StreamDetails extends Stream {
  isViewed: boolean;
  isSaved: boolean;
  isFollowing: boolean;
}

export interface GetLiveStreamListResponse {
  success: boolean;
  message: string;
  data: StreamData;
}

export interface StreamData {
  totalCount: number;
  page: number;
  limit: number;
  streams: GetLiveStreamListStream[];
}

export interface GetLiveStreamListStream {
  _id: string;
  videoUrl: string;
  transcodedUrl: string;
  type: string;
  status: string;
  title: string;
  settings: GetLiveStreamStreamSettings;
  isLive: boolean;
  vodStatus: string;
  creatorId: string;
  description: string;
  category: string;
  tags: string[];
  isDeleted: boolean;
  thumbnailUrl: string;
  duration: number;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  sharesCount: number;
  roomId: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  creator: GetLiveStreamCreator;
  isLiked: boolean;
  isFollowing: boolean;
}

export interface GetLiveStreamStreamSettings {
  visibility: string;
}

export interface GetLiveStreamCreator {
  _id: string;
  username: string;
}
