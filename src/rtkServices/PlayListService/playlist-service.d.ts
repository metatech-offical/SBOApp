interface CreatePlayRes {
    success: boolean;
    message: string;
    data: PlaylistData;
  }
  interface CreatePlayReq {
    title: string;
    description: string;
  }
  
  interface PlaylistData {
    title: string;
    description: string;
    createdBy: string;
    _id: string;
    items: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  interface Playlist {
    _id: string;
    title: string;
    description: string;
    itemsCount: number;
    data: data[];
    pagination: pagination;
  }
  interface data {
    _id: string;
    playlists: string[];
  }
  interface pagination {
  }
  