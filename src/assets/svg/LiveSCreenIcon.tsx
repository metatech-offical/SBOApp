import * as React from 'react';
import Svg, {SvgProps, Path, G, Line, Rect, Defs, ClipPath} from 'react-native-svg';
export const MuteIcon = (props: SvgProps) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      d="M9.99935 12.916C11.841 12.916 13.3327 11.4243 13.3327 9.58268V4.99935C13.3327 3.15768 11.841 1.66602 9.99935 1.66602C8.15768 1.66602 6.66602 3.15768 6.66602 4.99935V9.58268C6.66602 11.4243 8.15768 12.916 9.99935 12.916Z"
      stroke="#EEEEEE"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.625 8.04102V9.45768C3.625 12.9743 6.48333 15.8327 10 15.8327C13.5167 15.8327 16.375 12.9743 16.375 9.45768V8.04102"
      stroke="#EEEEEE"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.8418 5.35859C9.5918 5.08359 10.4085 5.08359 11.1585 5.35859"
      stroke="#EEEEEE"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.33398 7.12461C9.77565 7.00794 10.234 7.00794 10.6757 7.12461"
      stroke="#EEEEEE"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 15.834V18.334"
      stroke="#EEEEEE"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const UnmuteIcon = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 1024 1024"
    fill="#EEEEEE"
    {...props}>
    <G id="SVGRepo_bgCarrier" strokeWidth={0} />
    <G
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <G id="SVGRepo_iconCarrier">
      <Path
        fill="#EEEEEE"
        d="m412.16 592.128-45.44 45.44A191.232 191.232 0 0 1 320 512V256a192 192 0 1 1 384 0v44.352l-64 64V256a128 128 0 1 0-256 0v256c0 30.336 10.56 58.24 28.16 80.128zm51.968 38.592A128 128 0 0 0 640 512v-57.152l64-64V512a192 192 0 0 1-287.68 166.528l47.808-47.808zM314.88 779.968l46.144-46.08A222.976 222.976 0 0 0 480 768h64a224 224 0 0 0 224-224v-32a32 32 0 1 1 64 0v32a288 288 0 0 1-288 288v64h64a32 32 0 1 1 0 64H416a32 32 0 1 1 0-64h64v-64c-61.44 0-118.4-19.2-165.12-52.032zM266.752 737.6A286.976 286.976 0 0 1 192 544v-32a32 32 0 0 1 64 0v32c0 56.832 21.184 108.8 56.064 148.288L266.752 737.6z"
      />
      <Path
        fill="#EEEEEE"
        d="M150.72 859.072a32 32 0 0 1-45.44-45.056l704-708.544a32 32 0 0 1 45.44 45.056l-704 708.544z"
      />
    </G>
  </Svg>
);


export const CameraHideIcon = (props: SvgProps) => (
  <Svg
    width={19}
    height={20}
    viewBox="0 0 19 20"
    fill="none"
    {...props}
  >
    <Path
      d="M9.91828 16.6676H4.91495C2.41328 16.6676 1.58203 15.0051 1.58203 13.3347V6.66885C1.58203 4.16719 2.41328 3.33594 4.91495 3.33594H9.91828C12.4199 3.33594 13.2512 4.16719 13.2512 6.66885V13.3347C13.2512 15.8364 12.412 16.6676 9.91828 16.6676Z"
      stroke="#EEEEEE"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.4528 14.0381L13.252 12.4943V7.49893L15.4528 5.95518C16.5295 5.20309 17.4161 5.66226 17.4161 6.98434V13.0168C17.4161 14.3389 16.5295 14.7981 15.4528 14.0381Z"
      stroke="#EEEEEE"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CameraShowIcon = (props: SvgProps) => (
  <Svg
    width={19}
    height={20}
    viewBox="0 0 19 20"
    fill="none"
    {...props}
  >
    <Path
      d="M9.91828 16.6676H4.91495C2.41328 16.6676 1.58203 15.0051 1.58203 13.3347V6.66885C1.58203 4.16719 2.41328 3.33594 4.91495 3.33594H9.91828C12.4199 3.33594 13.2512 4.16719 13.2512 6.66885V13.3347C13.2512 15.8364 12.412 16.6676 9.91828 16.6676Z"
      stroke="#EEEEEE"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.4528 14.0381L13.252 12.4943V7.49893L15.4528 5.95518C16.5295 5.20309 17.4161 5.66226 17.4161 6.98434V13.0168C17.4161 14.3389 16.5295 14.7981 15.4528 14.0381Z"
      stroke="#EEEEEE"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1={17}
      y1={3}
      x2={2}
      y2={18}
      stroke="#EEEEEE"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);

export const SwitchCameraIcon = (props: SvgProps) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    {...props}
  >
    <Path
      d="M16.5 9C16.5 13.14 13.14 16.5 9 16.5C4.86 16.5 2.3325 12.33 2.3325 12.33M2.3325 12.33H5.7225M2.3325 12.33V16.08M1.5 9C1.5 4.86 4.83 1.5 9 1.5C14.0025 1.5 16.5 5.67 16.5 5.67M16.5 5.67V1.92M16.5 5.67H13.17"
      stroke="#EEEEEE"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const EndLiveScreen = (props: SvgProps) => (
  <Svg
    width={9}
    height={10}
    viewBox="0 0 9 10"
    fill="none"
    {...props}
  >
    <Rect y={0.5} width={9} height={9} rx={2} fill="#FF2C35" />
  </Svg>
);


export const ForwardIcon = (props: SvgProps) => (
  <Svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    {...props}
  >
    <Path
      d="M16.31 5.21757L14 2.33594"
      stroke="#F0F0F0"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22.2713 9.09856C23.5663 10.8252 24.3713 12.9602 24.3713 15.2936C24.3713 21.0219 19.7279 25.6652 13.9996 25.6652C8.27128 25.6652 3.62793 21.0219 3.62793 15.2936C3.62793 9.56523 8.27128 4.92188 13.9996 4.92188C14.7929 4.92188 15.563 5.02693 16.3096 5.20193"
      stroke="#F0F0F0"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.1299 18.5737V12.3438L9.37988 14.2921"
      stroke="#F0F0F0"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.3333 12.3438C17.6167 12.3438 18.6667 13.3937 18.6667 14.6771V16.2521C18.6667 17.5354 17.6167 18.5854 16.3333 18.5854C15.05 18.5854 14 17.5354 14 16.2521V14.6771C14 13.3821 15.05 12.3438 16.3333 12.3438Z"
      stroke="#F0F0F0"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);


export const BackwardIcon = (props: SvgProps) => (
  <Svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    {...props}
  >
    <Path
      d="M11.1299 18.5737V12.3438L9.37988 14.2921"
      stroke="#F0F0F0"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.6904 5.21757L14.0004 2.33594"
      stroke="#F0F0F0"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.72795 9.09856C4.43295 10.8252 3.62793 12.9602 3.62793 15.2936C3.62793 21.0219 8.27128 25.6652 13.9996 25.6652C19.7279 25.6652 24.3713 21.0219 24.3713 15.2936C24.3713 9.56523 19.7279 4.92188 13.9996 4.92188C13.2063 4.92188 12.4363 5.02693 11.6896 5.20193"
      stroke="#F0F0F0"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.3333 12.3438C17.6167 12.3438 18.6667 13.3937 18.6667 14.6771V16.2521C18.6667 17.5354 17.6167 18.5854 16.3333 18.5854C15.05 18.5854 14 17.5354 14 16.2521V14.6771C14 13.3821 15.05 12.3438 16.3333 12.3438Z"
      stroke="#F0F0F0"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);


export const ChatIcon = (props: SvgProps) => (
  <Svg
    width={19}
    height={20}
    viewBox="0 0 19 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M8.07461 11.9004H5.22461"
      stroke="#EEEEEE"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11 9.00098L5.22461 9.05078"
      stroke="#EEEEEE"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.7746 6.19922H5.22461"
      stroke="#EEEEEE"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.12565 17.9173H11.8757C15.834 17.9173 17.4173 16.334 17.4173 12.3757V7.62565C17.4173 3.66732 15.834 2.08398 11.8757 2.08398H7.12565C3.16732 2.08398 1.58398 3.66732 1.58398 7.62565V12.3757C1.58398 16.334 3.16732 17.9173 7.12565 17.9173Z"
      stroke="#EEEEEE"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

 const DownArrowIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_876_10964)">
      <Path
        d="M6 9L12 15L18 9"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_876_10964">
        <Rect width={24} height={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);


export const LiveLikeIcon = (props: SvgProps) => (
  <Svg
    width={21}
    height={22}
    viewBox="0 0 21 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M11.0405 18.7082C10.743 18.8132 10.253 18.8132 9.95555 18.7082C7.41805 17.8419 1.74805 14.2282 1.74805 8.10316C1.74805 5.39941 3.9268 3.21191 6.61305 3.21191C8.20555 3.21191 9.6143 3.98191 10.498 5.17191C11.3818 3.98191 12.7993 3.21191 14.383 3.21191C17.0693 3.21191 19.248 5.39941 19.248 8.10316C19.248 14.2282 13.578 17.8419 11.0405 18.7082Z"
      fill={props?.fill}
      stroke={props?.fill}
      strokeWidth={1.5625}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SoundOn = (props: SvgProps) => (
  <Svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    {...props}
  >
    <Path
      d="M1.83398 9.16729V12.834C1.83398 14.6673 2.75065 15.584 4.58398 15.584H5.89482C6.23398 15.584 6.57315 15.6848 6.86648 15.859L9.54315 17.5365C11.8532 18.9848 13.7507 17.9306 13.7507 15.2081V6.79312C13.7507 4.06145 11.8532 3.01645 9.54315 4.46479L6.86648 6.14229C6.57315 6.31645 6.23398 6.41729 5.89482 6.41729H4.58398C2.75065 6.41729 1.83398 7.33395 1.83398 9.16729Z"
      fill="#F0F0F0"
    />
    <Path
      d="M16.5 7.33398C18.1317 9.50648 18.1317 12.4948 16.5 14.6673"
      stroke="#F0F0F0"
      strokeWidth={1.375}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.1777 5.04102C20.8269 8.57018 20.8269 13.4285 18.1777 16.9577"
      stroke="#F0F0F0"
      strokeWidth={1.375}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SoundOff = (props: SvgProps) => (
  <Svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    {...props}
  >
    <Path
      d="M16.5003 15.3545C16.3536 15.3545 16.2161 15.3086 16.0877 15.217C15.7852 14.9878 15.7211 14.557 15.9503 14.2545C17.1053 12.7145 17.3528 10.6703 16.6103 8.90112C16.4636 8.55279 16.6286 8.14946 16.9769 8.00279C17.3253 7.85612 17.7286 8.02112 17.8753 8.36946C18.8103 10.5878 18.4894 13.1636 17.0503 15.0886C16.9128 15.2628 16.7111 15.3545 16.5003 15.3545Z"
      fill="#F0F0F0"
    />
    <Path
      d="M18.178 17.6467C18.0313 17.6467 17.8938 17.6009 17.7655 17.5092C17.463 17.2801 17.3988 16.8492 17.628 16.5467C19.5897 13.9342 20.0205 10.4326 18.7555 7.41675C18.6088 7.06841 18.7738 6.66508 19.1222 6.51841C19.4705 6.37175 19.8738 6.53675 20.0205 6.88508C21.478 10.3501 20.983 14.3651 18.728 17.3717C18.5997 17.5551 18.3888 17.6467 18.178 17.6467Z"
      fill="#F0F0F0"
    />
    <Path
      d="M12.8701 11.8808C13.4476 11.3033 14.4376 11.7158 14.4376 12.5317V15.2175C14.4376 16.7942 13.8693 17.9767 12.8518 18.545C12.4393 18.7742 11.9809 18.8842 11.5043 18.8842C10.7709 18.8842 9.9826 18.6367 9.17594 18.1325L8.58927 17.7658C8.09427 17.4542 8.01177 16.7575 8.42427 16.345L12.8701 11.8808Z"
      fill="#F0F0F0"
    />
    <Path
      d="M19.9565 2.04414C19.6815 1.76914 19.2323 1.76914 18.9573 2.04414L14.4198 6.58164C14.3648 5.11497 13.8148 4.01497 12.8432 3.47414C11.8165 2.90581 10.5057 3.05247 9.16732 3.88664L6.49982 5.55497C6.31648 5.66497 6.10565 5.72914 5.89482 5.72914H5.04232H4.58398C2.36565 5.72914 1.14648 6.94831 1.14648 9.16664V12.8333C1.14648 15.0516 2.36565 16.2708 4.58398 16.2708H4.73065L2.03565 18.9658C1.76065 19.2408 1.76065 19.69 2.03565 19.965C2.18232 20.0933 2.35648 20.1666 2.53982 20.1666C2.72315 20.1666 2.89732 20.0933 3.03482 19.9558L19.9565 3.03414C20.2407 2.75914 20.2407 2.31914 19.9565 2.04414Z"
      fill="#F0F0F0"
    />
  </Svg>
);

