// StreamListener.js
import {api} from '@rtkServices/index';
import {socket, socketListen} from '@socket/index';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

const StreamListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleStreamStarted = (data: any) => {
      if (data) {
        dispatch(
          api.util.invalidateTags(['LiveStream', 'UserProfile', 'Search']),
        );
      }
    };
    const subs = socketListen('new_stream', handleStreamStarted);

    return () => {
      socket?.off('new_stream', handleStreamStarted);
      subs?.removeAllListeners('new_stream');
    };
  }, [dispatch]);

  return null;
};

export default StreamListener;
