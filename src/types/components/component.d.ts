interface CustomBottomSheetProps {
  index?: number;
  onClose?: () => void;
  renderView: () => any;
  label?: string;
  submitLabel?: string;
  onSubmit?: () => void;
  paddingHorizontal?: number;
  onPress?: () => void;
  RenderFooter?: () => any;
  forComments?: boolean;
  useBottomSheetCustomFooter?: boolean;
  containerStyle?: object;
}

type StackHeaderProps = {
  title?: string;
  onBackPress?: () => void;
  style?: object;
  titleStyle?: object;
  subtitle?: string;
  onTextPress?: () => void;
};

type StackHeadersProps = {
  title?: string;
  onBackPress?: () => void;
  style?: object;
  titleStyle?: object;
  rightIcon?: boolean;
  onRightPress?: () => void;
  rightIconText?: string;
  rightIconStyle?: ViewStyle;
  icon?: any;
  showArrowDown?: boolean;
  rightIconTextStyle?: object;
  iconStyle?: object;
};

interface ICalenderProps {
  initialDate?: string;
}

interface ICheckBoxProp {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  renderContent: () => any;
}

interface RadioOption {
  label: string;
  value: string | number;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue?: string | number;
  onSelect: (value: string | number) => void;
  containerStyle?: object;
  labelStyle?: object;
  label?: string;
}

type DataEmptyProps = {
  uri: any;
  title: string;
};

interface CustomDropDownProps {
  data: any[];
  placeHolder: string;
  commonStyle?: any;
  onSelect: (item: any) => void;
  error?: string;
  buttonTextStyle?: any;
  isSearchable?: boolean;
  defaultValue?: any;
  containerStyle?: any;
  label?: string;
  isRequired?: boolean;
  disabled?: boolean;
  labelStyle?: any;
  menuStyle?: any;
}

interface ActivityFilter {
  fromDate: Date | null;
  toDate: Date | null;
  filter: string | null;
}

interface MyActivityFilterProps {
  closeBottomSheet: () => void;
  onApplyFilter: (filter: ActivityFilter) => void;
  ActivityFilter: ActivityFilter;
}

interface ActivityItem {
  id: number;
  type: 'order' | 'ticket' | 'other';
  timeAgo: string;
  description: string;
}

interface CustomDatePickerProps {
  onDateChange: (date: Date | null) => void;
  initialDate?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  style?: StyleSheet.View;
  label?: string;
}

interface FilterSheetProps {
  index?: number;
  onClose?: () => void;
  renderView?: () => React.ReactNode;
  label?: string;
  submitLabel?: string;
  onSubmit?: () => void;
  paddingHorizontal?: number;
  RenderFooter?: () => React.ReactNode;
  forComments?: () => React.ReactNode;
  useBottomSheetCustomFooter?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  footerStyle?: StyleProp<ViewStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
  headerViewStyle?: StyleProp<ViewStyle>;
  customTitleStyle?: StyleProp<TextStyle>;
  cuttomSnapPoints?: string[];
}

interface SettingsItem {
  type: 'item';
  id: number;
  title: string;
  icon: string;
  screen: string;
  badge?: string | null;
  color?: string;
  image?: any;
}
interface ViewableItemsChangedInfo {
  viewableItems: ViewableItem[];
  changed: ViewableItem[];
}
interface Comment {
  _id: string;
  user: User;
  stream: string;
  content: string;
  parentId: string | null;
  replies: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface CommentInputProps {
  onSubmit: (
    text: string,
    isReplying: boolean,
    replyingTo: string | null,
  ) => void;
  isReplying: boolean;
  replyingTo: string | null;
  setReplyingTo: (value: string | null) => void;
  inputStyle?: StyleProp<ViewStyle>;
  userImage?: boolean;
}
interface Feed {
  _id: string;
  authorDetails?: any;
  commentCount?: number;
  [key: string]: any;
}
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onIconPress?: (value: string) => void;
  onsubmitEditing?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
}
type StackHeaderProps = {
  title?: string;
  onBackPress?: () => void;
  style?: object;
  titleStyle?: object;
};

interface WishlistAndOrderCardProps {
  item: any;
  isInWishlist: boolean;
  onPress: () => void;
}

interface BookingHistoryCardProps {
  date: string;
  cards: BookingCard[];
}

interface BookingCard {
  id: string;
  title: string;
  ticketCount: string;
  image: string;
}
interface CreatorEventCardProps {
  id: string;
  event_Name: string;
  event_Cover_Image: string;
  event_Date: string;
  event_Status: string;
  SoldticketsCount: number;
  onPress: () => void;
}
interface EventCardProps {
  id: string;
  event_Name: string;
  event_Cover_Image: import('react-native').ImageSourcePropType;
  event_Date: string;
  event_Status: string;
  SoldticketsCount: number;
  onPress: () => void;
  showStartTime: string;
  ShowEndTime: string;
  item?:any
}
interface TicketCardProps {
  id: string;
  event_Name: string;
  event_Cover_Image: string;
  event_Date: string;
  showStartTime: string;
  onPress: () => void;
  ShowEndTime: string;
  address: string;
}

interface LiveCardContainerProps {
  navigation: any;
  item: GetLiveStreamListStream;
  isOptionPress: () => void;
  handleFollow: () => void;
  type?: string;
}

interface PostListCardProps {
  postData: any;
  onComment: (id: string) => void;
  onShare: (id: string, postData: any) => void;
  onMorePress?: (id: string, postData: any) => void; // Made optional since we'll handle internally
  onUserPress: (user: any, id: string) => void;
  showVerifiedBadge?: boolean;
  showActionBar?: boolean;
  cardStyle?: any;
  textColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  margin?: number;
  padding?: number;
}

interface SubscriptionsListCardProps {
  item: SubscribedCreator;
  onUnsubscribe: () => void;
}

interface VideoCardProps {
  imageSource: string;
  title: string;
  streamedTime: string;
  duration: string;
  viewCount: string;
  onPress: () => void;
  item?: any;
}

interface VideoCardProps1 {
  video: any;
  playlistId: string;
  refetch?: () => void;
  onReportVideo?: () => void;
}

interface CustomButtonProp {
  isLoading?: boolean;
  text: string;
  onPress: () => void;
  btnStyle?: any;
  textStyle?: any;
  icon?: any;
  disabled?: boolean;
  iconRight?: any;
}

interface PostCarouselProps {
  images: string[];
  height?: number;
  width?: number;
  autoPlay?: boolean;
  borderRadius?: number;
  autoPlayInterval?: number;
}

interface MerchandiseHeaderProps {
  onBackPress: () => void;
  style?: any;
  onCartPress?: () => void;
  isCartVisible?: boolean;
  icon?: any;
}

interface LoaderProps {
  visible: boolean;
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  overlay?: boolean;
}

interface UnblockModalProps {
  modalVisible: boolean;
  handleCancel: () => void;
  selectedUser: any;
  handleUnblock: () => void;
  isLoading: boolean;
}

interface ControllersProps {
  isLive: boolean;
  seekBackward: () => void;
  paused: boolean;
  setPaused: (value: boolean) => void;
  setMuted: (value: boolean) => void;
  muted: boolean;
  seekForward: () => void;
}

interface CustomPlayerHeaderProps {
  navigation?: any;
  CreatorData?: any;
  streamDetail?: any;
  isFollowing?: boolean;
  selectedUrl: string;
  handleFollow?: () => void;
  handleSetting?: () => void;
  watchCount?: number;
  LiveHeader?: boolean;
  isLive?: boolean;
  type?: string;
  showSettingIcon?: boolean;
}

interface CustomVideoPlayerProps {
  playerRef: any;
  uri: string;
  paused?: boolean;
  muted?: boolean;
  onProgress?: (data: any) => void;
  onLoad?: (data: any) => void;
  onError?: (error: any) => void;
  renderView?: () => any;
  playbackRate?: number;
  onEnd?: (data: any) => void;
}

interface ProductInfoProps {
  onNextStep?: (data: any) => void;
  onSaveDraft?: (data: any) => void;
  control: any;
  handleSubmit: any;
  watch: any;
  setValue: any;
  isEdit?: boolean;
  newCollectionId?: string;
}

interface ProductMediaProps {
  loadingDraft: boolean;
  loadingPublish: boolean;
  images: any[];
  onImagesChange: (images: any[]) => void;
  onSaveDraft?: (data: any) => void;
  onPublish?: (data: any) => void;
  isEdit?: boolean;
}
