import * as React from 'react';
import Svg, {SvgProps, Path, G, Defs, ClipPath, Rect} from 'react-native-svg';
export const OptionIcon = (props: SvgProps) => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    stroke={props.stroke || 'white'}
    {...props}>
    <Path
      d="M7.9987 8.66536C8.36689 8.66536 8.66536 8.36689 8.66536 7.9987C8.66536 7.63051 8.36689 7.33203 7.9987 7.33203C7.63051 7.33203 7.33203 7.63051 7.33203 7.9987C7.33203 8.36689 7.63051 8.66536 7.9987 8.66536Z"
      fill="white"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.9987 4.0013C8.36689 4.0013 8.66536 3.70283 8.66536 3.33464C8.66536 2.96645 8.36689 2.66797 7.9987 2.66797C7.63051 2.66797 7.33203 2.96645 7.33203 3.33464C7.33203 3.70283 7.63051 4.0013 7.9987 4.0013Z"
      fill="white"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.9987 13.3333C8.36689 13.3333 8.66536 13.0349 8.66536 12.6667C8.66536 12.2985 8.36689 12 7.9987 12C7.63051 12 7.33203 12.2985 7.33203 12.6667C7.33203 13.0349 7.63051 13.3333 7.9987 13.3333Z"
      fill="white"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const UnLikeIcon = (props: SvgProps) => (
  <Svg width={26} height={25} viewBox="0 0 26 25" fill="none" {...props}>
    <Path
      d="M13.3835 21.3082C13.0353 21.4311 12.4618 21.4311 12.1136 21.3082C9.14381 20.2944 2.50781 16.065 2.50781 8.89645C2.50781 5.73206 5.05776 3.17188 8.20166 3.17188C10.0655 3.17188 11.7142 4.07306 12.7486 5.4658C13.7829 4.07306 15.4419 3.17188 17.2954 3.17188C20.4393 3.17188 22.9893 5.73206 22.9893 8.89645C22.9893 16.065 16.3533 20.2944 13.3835 21.3082Z"
      fill="transparent"
      stroke="white"
      strokeWidth={1.8287}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const LikeIcon = (props: SvgProps) => (
  <Svg width={26} height={25} viewBox="0 0 26 25" fill="red" {...props}>
    <Path
      d="M13.3835 21.3082C13.0353 21.4311 12.4618 21.4311 12.1136 21.3082C9.14381 20.2944 2.50781 16.065 2.50781 8.89645C2.50781 5.73206 5.05776 3.17188 8.20166 3.17188C10.0655 3.17188 11.7142 4.07306 12.7486 5.4658C13.7829 4.07306 15.4419 3.17188 17.2954 3.17188C20.4393 3.17188 22.9893 5.73206 22.9893 8.89645C22.9893 16.065 16.3533 20.2944 13.3835 21.3082Z"
      fill="transparent"
      stroke="red"
      strokeWidth={1.8287}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ShortsCommentIcon = (props: SvgProps) => (
  <Svg width={26} height={25} viewBox="0 0 26 25" fill="none" {...props}>
    <Path
      d="M9.1682 19.7843H8.65616C4.55987 19.7843 2.51172 18.7602 2.51172 13.6398V8.51944C2.51172 4.42315 4.55987 2.375 8.65616 2.375H16.8488C20.9451 2.375 22.9932 4.42315 22.9932 8.51944V13.6398C22.9932 17.7361 20.9451 19.7843 16.8488 19.7843H16.3367C16.0193 19.7843 15.712 19.9379 15.5175 20.1939L13.9813 22.242C13.3055 23.1432 12.1995 23.1432 11.5236 22.242L9.98746 20.1939C9.82361 19.9686 9.4447 19.7843 9.1682 19.7843Z"
      stroke="white"
      strokeWidth={1.75556}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.8443 11.5902H16.8535"
      stroke="white"
      strokeWidth={2.34074}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.7466 11.5902H12.7558"
      stroke="white"
      strokeWidth={2.34074}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.64899 11.5902H8.65819"
      stroke="white"
      strokeWidth={2.34074}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ShortsShareIcon = (props: SvgProps) => (
  <Svg width={26} height={26} viewBox="0 0 26 26" fill="none" {...props}>
    <G clipPath="url(#clip0_876_24814)">
      <Path
        d="M13.7761 4.75V8.8463C7.0428 9.89904 4.53894 15.7977 3.53535 21.1352C3.49746 21.3461 9.04896 15.0297 13.7761 14.9907V19.087L21.9687 11.9185L13.7761 4.75Z"
        stroke="white"
        strokeWidth={2.04815}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_876_24814">
        <Rect
          width={24.5778}
          height={24.5778}
          fill="white"
          transform="translate(0.462891 0.652344)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);

export const PauseIcon = (props: SvgProps) => (
  <Svg fill="#ffffff" viewBox="0 0 32 32" stroke="#ffffff" {...props}>
    <G id="SVGRepo_bgCarrier" strokeWidth={0} />
    <G
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <G id="SVGRepo_iconCarrier">
      <Path d="M5.92 24.096q0 0.832 0.576 1.408t1.44 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.44 0.576t-0.576 1.44v16.16zM18.016 24.096q0 0.832 0.608 1.408t1.408 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.408 0.576t-0.608 1.44v16.16z" />
    </G>
  </Svg>
);

export const PlayIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 16 16" fill="#ffffff" stroke="#ffffff" {...props}>
    <G id="SVGRepo_bgCarrier" strokeWidth={0} />
    <G
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <G id="SVGRepo_iconCarrier">
      <Path
        d="m 2 2.5 v 11 c 0 1.5 1.269531 1.492188 1.269531 1.492188 h 0.128907 c 0.246093 0.003906 0.488281 -0.050782 0.699218 -0.171876 l 9.796875 -5.597656 c 0.433594 -0.242187 0.65625 -0.734375 0.65625 -1.226562 c 0 -0.492188 -0.222656 -0.984375 -0.65625 -1.222656 l -9.796875 -5.597657 c -0.210937 -0.121093 -0.453125 -0.175781 -0.699218 -0.175781 h -0.128907 s -1.269531 0 -1.269531 1.5 z m 0 0"
        fill="#ffffff"
      />
    </G>
  </Svg>
);

export const ReplyIcon = (props: SvgProps) => (
  <Svg width={13} height={13} viewBox="0 0 13 13" fill="none" {...props}>
    <Path
      d="M5.95833 4.33366L4.33333 5.95866M4.33333 5.95866L5.95833 7.58366M4.33333 5.95866H8.66667M9.75 2.16699C10.181 2.16699 10.5943 2.3382 10.899 2.64294C11.2038 2.94769 11.375 3.36102 11.375 3.79199V8.12533C11.375 8.5563 11.2038 8.96963 10.899 9.27437C10.5943 9.57912 10.181 9.75033 9.75 9.75033H7.04167L4.33333 11.3753V9.75033H3.25C2.81902 9.75033 2.4057 9.57912 2.10095 9.27437C1.7962 8.96963 1.625 8.5563 1.625 8.12533V3.79199C1.625 3.36102 1.7962 2.94769 2.10095 2.64294C2.4057 2.3382 2.81902 2.16699 3.25 2.16699H9.75Z"
      stroke="#B1B0B0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const DeleteIcon = (props: SvgProps) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    stroke={props.stroke || '#D13C50'}
    {...props}>
    <Path
      d="M3 5.25H15M7.5 8.25V12.75M10.5 8.25V12.75M3.75 5.25L4.5 14.25C4.5 14.6478 4.65804 15.0294 4.93934 15.3107C5.22064 15.592 5.60218 15.75 6 15.75H12C12.3978 15.75 12.7794 15.592 13.0607 15.3107C13.342 15.0294 13.5 14.6478 13.5 14.25L14.25 5.25M6.75 5.25V3C6.75 2.80109 6.82902 2.61032 6.96967 2.46967C7.11032 2.32902 7.30109 2.25 7.5 2.25H10.5C10.6989 2.25 10.8897 2.32902 11.0303 2.46967C11.171 2.61032 11.25 2.80109 11.25 3V5.25"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
