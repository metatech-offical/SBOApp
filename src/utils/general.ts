import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import {Dimensions, Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
import {CheckPermission} from './permision';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '@constant/colors';
import dayjs from 'dayjs';
export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
export const bottomTabHeight = 0;
export const mainHeaderHeight = 0;
export const isIosDevice = () => {
  if (Platform.OS == 'ios') {
    return true;
  } else {
    false;
  }
};
export const setToken = (accessToken: string, refreshToken: string) => {
  AsyncStorage.setItem('accessToken', accessToken);
  AsyncStorage.setItem('refreshToken', refreshToken);
};
export const getToken = async () => {
  let [accessToken, refreshToken] = await Promise.all([
    AsyncStorage.getItem('accessToken'),
    AsyncStorage.getItem('refreshToken'),
  ]);
  return {accessToken, refreshToken};
};
export const setData = (key: string, value: any) => {
  AsyncStorage.setItem(key, value);
};
export const getData = (key: string) => {
  return AsyncStorage.getItem(key);
};
export const clearStorage = () => {
  AsyncStorage.clear();
};
export const getLanguage = async () => {
  const lang = await AsyncStorage.getItem('language');
  return lang || 'en';
};
export const setLanguage = async (language: string) => {
  await AsyncStorage.setItem('language', language);
};
export const showToast = (msg: string) => {
  Toast.show(`${msg}`, Toast.LONG);
};
export async function handleOpenGallery() {
  // Android 13+: system photo picker (no READ_MEDIA_* permission)
  if (Platform.OS === 'android') {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      selectionLimit: 10,
      quality: 0.85,
    });
    if (result.didCancel || !result.assets?.length) {
      return [];
    }
    return result.assets.map((asset: any) => {
      const mime = asset.type || '';
      const isImage = mime.startsWith('image');
      const isVideo = mime.startsWith('video');
      const size = asset.fileSize || 0;
      const durationMs = asset.duration ? asset.duration * 1000 : 0;
      const isValidSize = isImage ? size / (1024 * 1024) <= 25 : true;
      const isValidDuration = isVideo ? durationMs <= 60100 : true;
      return {
        path: asset.uri,
        sourceURL: asset.uri,
        mime,
        size,
        filename: asset.fileName,
        width: asset.width,
        height: asset.height,
        duration: durationMs,
        isValid: isValidSize && isValidDuration,
      };
    });
  }

  const imageResult = await ImageCropPicker.openPicker({
    multiple: true,
    maxFiles: 10,
    width: 500,
    height: 500,
    limit: 10,
    mediaType: 'any',
    showCropFrame: true,
  });
  const validatedData = imageResult.map((item: any) => {
    const isImage = item.mime.startsWith('image');
    const isVideo = item.mime.startsWith('video');
    const isValidSize = isImage
      ? item.size / (1024 * 1024) <= 25 // size in MB for images
      : true;
    const isValidDuration = isVideo
      ? item.duration <= 60100 // duration in seconds for videos
      : true;
    return {
      ...item,
      isValid: isValidSize && isValidDuration,
    };
  });
  return validatedData;
}
const getFileNameFromPath = (path: string) => {
  const parts = path.split('/');
  return parts[parts.length - 1];
};
export const handleOpenCamera = async () => {
  const imageResult: any = await ImageCropPicker.openCamera({
    width: 500,
    height: 500,
    mediaType: 'any',
    cropping: true,
    multiple: true,
    showCropFrame: true,
  });
  const isImage = imageResult.mime.startsWith('image');
  const isVideo = imageResult.mime.startsWith('video');
  const isValidSize = isImage ? imageResult.size / (1024 * 1024) <= 25 : true;
  const isValidDuration = isVideo ? imageResult?.duration <= 60100 : true;
  const newImage = {
    ...imageResult,
    isValid: isValidSize && isValidDuration,
  };
  return newImage;
};
export const handleVideoSelection = async (isShorts: boolean = false) => {
  // Prefer system picker path used by handleVideoSelection2
  return handleVideoSelection2(isShorts);
};
export const handleVideoSelection2 = async (isShorts: boolean = false) => {
  try {
    if (Platform.OS === 'ios') {
      const hasPermission = await CheckPermission(
        PERMISSIONS.IOS.PHOTO_LIBRARY,
      );
      if (!hasPermission) {
        throw new Error('Permission to access media library was denied');
      }
    }
    // Android: system photo picker — no READ_MEDIA_VIDEO permission required
    const videoResult = await launchImageLibrary({
      mediaType: 'video',
      selectionLimit: 1,
    });
    console.log('videoResult', videoResult);
    if (videoResult.didCancel) {
      return null;
    }
    // Check if assets array exists and has items
    if (!videoResult.assets || videoResult.assets.length === 0) {
      throw new Error('No video selected');
    }
    const selectedVideo = videoResult.assets[0];
    const isVideo = selectedVideo.type?.startsWith('video');
    if (!isVideo) {
      throw new Error('Please select a video file');
    }
    // For shorts, duration must be <= 60 seconds
    if (isShorts && selectedVideo.duration && selectedVideo.duration > 60) {
      throw new Error('Shorts must be 60 seconds or less');
    }
    // Normalize duration to milliseconds (launchImageLibrary returns duration in seconds)
    const durationInMs = selectedVideo.duration
      ? selectedVideo.duration * 1000
      : 0;
    return {
      ...selectedVideo,
      path: selectedVideo.uri,
      mime: selectedVideo.type,
      fileName:
        selectedVideo?.fileName ||
        getFileNameFromPath(selectedVideo.originalPath || selectedVideo.uri || ''),
      duration: durationInMs,
      isValid: true,
    };
  } catch (error: any) {
    if (error.message) {
      showToast(error.message);
    }
    return null;
  }
};
export const getVideoHeight = () => {
  const insets = useSafeAreaInsets();
  const insetsHeight = insets?.bottom + insets?.top;
  if (isIosDevice()) {
    return screenHeight - bottomTabHeight - insetsHeight;
  } else {
    return screenHeight - bottomTabHeight;
  }
};
export const getTimeDifference = (dateTimeString: string) => {
  const inputDate = new Date(dateTimeString);
  const currentDate = new Date();
  const differenceInMs = currentDate.getTime() - inputDate.getTime();
  const minutes = Math.floor(differenceInMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (minutes < 60) {
    return `${minutes}min`;
  } else if (hours < 24) {
    return `${hours}hr`;
  } else if (days < 7) {
    return `${days}d`;
  } else if (weeks < 4) {
    return `${weeks}w`;
  } else if (months < 12) {
    return `${months}mo`;
  } else {
    return `${years}yr`;
  }
};
export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff === 0 ? 'Today' : `${diff} day${diff > 1 ? 's' : ''} ago`;
};
export const formatViews = (views: number) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M Views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K Views`;
  return `${views} Views`;
};
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};
//live method
export function convertMessageObject(data: OriginalData): ConvertedMessage[] {
  // Convert all messages in the messageList to array of objects
  return data?.messageList?.map(msg => ({
    username: msg?.fromUser?.userName,
    id: msg?.messageID?.toString(),
    message: msg?.message || '',
    timestamp: msg?.sendTime || 0,
  }));
}
export function charToRgbArray(char: string): [number, number, number] {
  if (!char) {
    return [0, 0, 0];
  }
  const asciiVal = char.charCodeAt(0);
  const r = (asciiVal * 3) % 256;
  const g = (asciiVal * 7) % 256;
  const b = (asciiVal * 11) % 256;
  return [r, g, b];
}
export const getStatusInfo = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return {
        text: 'Pending',
        color: '#FFA500',
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        borderColor: 'rgba(255, 165, 0, 0.3)',
      };
    case 'accepted':
      return {
        text: 'Accepted',
        color: Colors.greenColor,
        backgroundColor: 'rgba(3, 166, 61, 0.1)',
        borderColor: 'rgba(3, 166, 61, 0.3)',
      };
    case 'rejected':
      return {
        text: 'Rejected',
        color: Colors.red,
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        borderColor: 'rgba(255, 0, 0, 0.3)',
      };
    case 'completed':
      return {
        text: 'Delivered',
        color: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderColor: 'rgba(76, 175, 80, 0.3)',
      };
    default:
      return {
        text: status || 'Unknown',
        color: Colors.white,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
      };
  }
};
export const getStatusForTab = (tabId: string) => {
  switch (tabId) {
    case 'pending':
      return 'pending';
    case 'accepted':
      return 'accepted';
    case 'rejected':
      return 'rejected';
    case 'completed':
      return 'completed';
    default:
      return undefined; // 'all' tab
  }
};
export const DateformatDate = (dateString: string) => {
  const date = dayjs(dateString);
  const today = dayjs();
  const yesterday = dayjs().subtract(1, 'day');
  if (date.isSame(today, 'day')) {
    return 'Today';
  } else if (date.isSame(yesterday, 'day')) {
    return 'Yesterday';
  } else {
    return date.format('ddd, DD MMM YYYY');
  }
};
export const formatPrice = (price: number) => {
  return `${price}`;
};
export const getSizeText = (item: any) => {
  if (item?.variant?.size) {
    return item?.variant?.size;
  }
  return 'One Size';
};
export const formatPhxoneNumber = (number: string) => {
  if (number.startsWith('+')) return number;
  return `+91${number}`;
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const videoTimeDuration = (seconds: string | number) => {
  const totalSeconds = parseInt(seconds.toString(), 10);
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export const textConverter = (text: string) => {
  return text.replace(/_/g, ' ').replace(/\\n/g, '\n');
};

export const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'INR':
      return '₹';
    default:
      return '$';
  }
};

export const calculateDynamicTimestamps = (durationMs: number): number[] => {
  // Convert duration to seconds
  const durationInSeconds = Math.floor(durationMs / 1000);

  // Smart frame calculation based on video duration
  let numberOfThumbnails: number;

  if (durationInSeconds <= 2) {
    // Very short video (0-2s): 1 frame
    numberOfThumbnails = 1;
  } else if (durationInSeconds <= 5) {
    // Short video (3-5s): 2 frames
    numberOfThumbnails = 2;
  } else if (durationInSeconds <= 10) {
    // Medium-short video (6-10s): 3 frames
    numberOfThumbnails = 3;
  } else if (durationInSeconds <= 20) {
    // Medium video (11-20s): 4 frames
    numberOfThumbnails = 4;
  } else if (durationInSeconds <= 40) {
    // Medium-long video (21-40s): 5 frames
    numberOfThumbnails = 5;
  } else if (durationInSeconds <= 60) {
    // Long video (41-60s / 1 min): 6 frames
    numberOfThumbnails = 6;
  } else if (durationInSeconds <= 120) {
    // Very long video (1-2 min): 7 frames
    numberOfThumbnails = 7;
  } else if (durationInSeconds <= 180) {
    // Extra long video (2-3 min): 8 frames
    numberOfThumbnails = 8;
  } else {
    // Super long video (>3 min): 9 frames
    numberOfThumbnails = 9;
  }

  // Calculate evenly distributed timestamps
  const interval = durationInSeconds / (numberOfThumbnails + 1);

  return Array.from({length: numberOfThumbnails}, (_, i) =>
    Math.floor((i + 1) * interval * 1000),
  );
};

// Helper function to get the first thumbnail timestamp
export const getFirstThumbnailTimestamp = (durationMs: number): number => {
  const timestamps = calculateDynamicTimestamps(durationMs);
  return timestamps.length > 0 ? timestamps[0] : 1000; // fallback to 1000ms
};

export const eventFormatDate = (dateString: string) => {
  const date = new Date(dateString);
  const weekday = date.toLocaleString('en-US', {weekday: 'short'});
  const day = date.getDate();
  const month = date.toLocaleString('en-US', {month: 'short'});
  const year = date.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
};

export const eventFormatTime = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${period}`;
};

export function compareSelectedDate(selectedDateString: string) {
  // Parse the selected date string (YYYY-MM-DD) into a Date object
  const selectedDateParts = selectedDateString?.split('-');
  const selectedDate = new Date(
    selectedDateParts?.[0], // Year
    selectedDateParts?.[1] - 1, // Month (0-based index)
    selectedDateParts?.[2], // Day
  );

  // Get today's date
  const today = new Date();

  // Normalize both dates to midnight
  selectedDate?.setHours(0, 0, 0, 0);
  today?.setHours(0, 0, 0, 0);

  // Compare the dates
  if (selectedDate?.getTime() === today?.getTime()) {
    console.log('The selected date is today.');
    return 'today';
  } else if (selectedDate?.getTime() > today?.getTime()) {
    console.log('The selected date is in the future.');
    return 'future';
  } else {
    console.log('The selected date is in the past.');
    return 'past';
  }
}
