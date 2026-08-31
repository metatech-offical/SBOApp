import {Share} from 'react-native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export const formatCount = (value?: number | null) => {
  const count = Number(value) || 0;
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return String(count);
};

export const shareProfile = async (profile?: {
  username?: string;
  displayName?: string;
}) => {
  const name = profile?.displayName || profile?.username || 'this creator';
  const handle = profile?.username ? `@${profile.username}` : '';
  await Share.share({
    message: `Check out ${name}${handle ? ` (${handle})` : ''} on Smart App`,
  });
};
export const getDayDateMonth = (event_Date: any) => {
  try {
    const dateObj = dayjs(event_Date, 'DD MMM YYYY');
    // Extract day, month, year
    const day = dateObj.format('DD'); // "25"
    const month = dateObj.format('MMM'); // "Jan"
    const year = dateObj.format('YYYY'); // "2026"
    const dayOfWeek = dateObj.format('ddd'); 
    return {day, month, year,dayOfWeek};
  } catch (error) {
    console.error(error);
    return {};
  }
};


export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}