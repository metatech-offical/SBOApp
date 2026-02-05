interface IGetAllCommentRes {
  success: boolean;
  message: string;
  data: {
    comments: {
      _id: string;
      user: {
        _id: string;
        username: string;
        displayName: string;
        profilePicture: string;
      };
      content: string;
      createdAt: string;
      repliesCount: number;
    }[];
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      totalCount: number;
    };
  };
}
interface ICommentRequest {
  creatorId: string;
  contentId: string;
  contentType: 'shorts' | 'streams' | 'posts' | 'contentcomments' | 'users';
  commentText: string;
  replyTo?: string;
}

interface DeletePostReq {
  postId: string;
}
