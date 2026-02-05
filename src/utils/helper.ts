import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
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