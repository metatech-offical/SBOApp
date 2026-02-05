import {ZEGO_APP_NEW_SIGNIN_ID} from '@rtkServices/endpoints';
import ZegoExpressEngine, {
  ZegoEngineProfile,
  ZegoScenario,
  ZegoUser,
} from 'zego-express-engine-reactnative';

let engine: ZegoExpressEngine;

// Publisher initialization (for creators who are streaming)
const initEngineAndLogin = async ({
  appId,
  userId,
  zegoToken,
  roomId,
  userName,
}: {
  appId: string;
  userId: string;
  zegoToken: string;
  roomId: string;
  userName?: string;
}) => {
  console.log('Publisher - appId', appId);
  console.log('Publisher - userId', userId);
  console.log('Publisher - zegoToken', zegoToken);
  console.log('Publisher - roomId', roomId);

  try {
    const profile: ZegoEngineProfile = {
      appID: parseInt(appId),
      appSign: ZEGO_APP_NEW_SIGNIN_ID,
      scenario: ZegoScenario.General,
    };

    await ZegoExpressEngine.createEngineWithProfile(profile);
    engine = ZegoExpressEngine.instance();

    engine.on('roomStateUpdate', (roomID, state, errorCode) => {
      console.log('Room state:', state);
    });

    const user = new ZegoUser(userId, userName || userId);
    // @ts-ignore - We need to ignore TypeScript here as method signatures may differ
    await engine.loginRoom(roomId, user,{isUserStatusNotify: true});

    console.log(
      'Publisher engine initialized and logged into room successfully',
    );
    // Note: startPreview and startPublishingStream will be called separately when stream starts
  } catch (error) {
    console.log('Publisher initialization error:', error);
    throw error;
  }
};

// Viewer initialization (for users who are watching streams)
const initEngineForViewer = async ({
  appId,
  userId,
  zegoToken,
  username,
  roomId,
}: {
  appId: string;
  userId: string;
  zegoToken: string;
  roomId: string;
  username: string;
}) => {
  console.log('Viewer - appId', appId);
  console.log('Viewer - userId', userId);
  console.log('Viewer - zegoToken', zegoToken);
  console.log('Viewer - roomId', roomId);

  try {
    // Check if engine already exists and destroy it first
    if (engine) {
      try {
        // @ts-ignore
        await engine.logoutRoom();
        await ZegoExpressEngine.destroyEngine();
      } catch (error) {
        console.log('Engine cleanup error:', error);
      }
    }

    const profile: ZegoEngineProfile = {
      appID: parseInt(appId),
      appSign: ZEGO_APP_NEW_SIGNIN_ID,
      scenario: ZegoScenario.General,
    };

    await ZegoExpressEngine.createEngineWithProfile(profile);
    engine = ZegoExpressEngine.instance();

    // // Set up event listeners for viewer
    // engine.on('roomStateUpdate', (roomID, state, errorCode) => {
    //   console.log('Viewer room state:', state, 'Error:', errorCode);
    // });

    // engine.on(
    //   'playerStateUpdate',
    //   (streamID, state, errorCode, extendedData) => {
    //     console.log('Player state update:', {streamID, state, errorCode});
    //   },
    // );

    // engine.on('roomStreamUpdate', (roomID, updateType, streamList) => {
    //   console.log('Room stream update:', {roomID, updateType, streamList});
    // });

    const user = new ZegoUser(userId, username);
    // @ts-ignore - We need to ignore TypeScript here as method signatures may differ
    await engine.loginRoom(roomId, user,{isUserStatusNotify: true});

    console.log('Viewer engine initialized and logged into room');
  } catch (error) {
    console.log('Viewer initialization error:', error);
    throw error;
  }
};

// Start playing a stream (for viewers)
const startPlayingStream = async (streamId: string, playCanvas: any) => {
  try {
    if (!engine) {
      throw new Error('Engine not initialized');
    }

    console.log('Starting to play stream:', streamId);
    // @ts-ignore - We need to ignore TypeScript here as method signatures may differ
    await engine.startPlayingStream(streamId, playCanvas);
    console.log('Successfully started playing stream');
  } catch (error) {
    console.error('Failed to start playing stream:', error);
    throw error;
  }
};

// Stop playing a stream (for viewers)
const stopPlayingStream = async (streamId: string) => {
  try {
    if (!engine) {
      throw new Error('Engine not initialized');
    }

    console.log('Stopping stream:', streamId);
    // @ts-ignore - We need to ignore TypeScript here as method signatures may differ
    await engine.stopPlayingStream(streamId);
    console.log('Successfully stopped playing stream');
  } catch (error) {
    console.error('Failed to stop playing stream:', error);
    throw error;
  }
};

// Cleanup function for viewers
const cleanupViewer = async () => {
  try {
    if (engine) {
      // @ts-ignore
      await engine.logoutRoom();
      await ZegoExpressEngine.destroyEngine();
      console.log('Viewer cleanup completed');
    }
  } catch (error) {
    console.error('Viewer cleanup error:', error);
  }
};

// Enable/disable camera
const enableCamera = async (enable: boolean = true): Promise<boolean> => {
  try {
    if (!engine) {
      throw new Error('Engine not initialized');
    }

    // @ts-ignore - We need to ignore TypeScript here as method signatures may differ
    await engine.enableCamera(enable);
    console.log('Camera enabled:', enable);
    return true;
  } catch (error) {
    console.error('Failed to toggle camera:', error);
    throw error;
  }
};

// Enable/disable microphone
const enableMicrophone = async (enable: boolean = true): Promise<boolean> => {
  try {
    if (!engine) {
      throw new Error('Engine not initialized');
    }

    // Use enableAudioCaptureDevice instead of enableMic for better compatibility
    // @ts-ignore - We need to ignore TypeScript here as method signatures may differ
    await engine.enableAudioCaptureDevice(enable);
    console.log('Microphone enabled:', enable);
    return true;
  } catch (error) {
    console.error('Failed to toggle microphone:', error);
    throw error;
  }
};

// Switch camera
const switchCamera = async (isFront: boolean = true): Promise<boolean> => {
  try {
    if (!engine) {
      throw new Error('Engine not initialized');
    }

    // @ts-ignore - We need to ignore TypeScript here as method signatures may differ
    await engine.useFrontCamera(isFront); // Default to front camera
    console.log('Switched camera');
    return true;
  } catch (error) {
    console.error('Failed to switch camera:', error);
    throw error;
  }
};

const destoryInstance = async (roomID?: undefined | string) => {
  try {
    if (engine) {
      try {
        // @ts-ignore
        if (roomID) {
          await engine.logoutRoom(roomID);
        }
        await ZegoExpressEngine.destroyEngine();
      } catch (error) {
        console.log('Engine cleanup error:', error);
      }
    }
  } catch (error) {}
};

export {
  initEngineAndLogin,
  initEngineForViewer,
  startPlayingStream,
  stopPlayingStream,
  cleanupViewer,
  engine,
  enableCamera,
  enableMicrophone,
  switchCamera,
  destoryInstance,
};
