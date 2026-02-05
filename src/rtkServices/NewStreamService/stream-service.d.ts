interface CreateStream {
  data?: {
    _id?: string;
    type: string;
    status: string;
    visibility: string;
    title: string;
    url: string;
    message?: string;
  };
}

interface DeleteStreamReq {
  streamId: string;
}
