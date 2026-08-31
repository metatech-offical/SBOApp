import * as React from 'react';
import Svg, {
  SvgProps,
  G,
  Path,
  Defs,
  ClipPath,
  Rect,
  LinearGradient,
} from 'react-native-svg';
export const BasketIcon = (props: SvgProps) => (
  <Svg width={17} height={18} viewBox="0 0 17 18" fill="none" {...props}>
    <G clipPath="url(#clip0_876_25306)">
      <Path
        d="M3.93766 6.25H13.562C13.7602 6.24998 13.9561 6.29282 14.1363 6.37561C14.3164 6.45839 14.4765 6.57915 14.6056 6.7296C14.7347 6.88006 14.8298 7.05665 14.8842 7.24728C14.9387 7.4379 14.9513 7.63805 14.9212 7.834L14.0584 12.751C13.9834 13.2381 13.7366 13.6822 13.3626 14.003C12.9886 14.3238 12.512 14.5001 12.0192 14.5H5.47973C4.98706 14.5 4.51068 14.3236 4.13678 14.0028C3.76289 13.682 3.51617 13.2379 3.44129 12.751L2.57848 7.834C2.54834 7.63805 2.56094 7.4379 2.6154 7.24728C2.66986 7.05665 2.7649 6.88006 2.894 6.7296C3.0231 6.57915 3.18321 6.45839 3.36336 6.37561C3.5435 6.29282 3.73941 6.24998 3.93766 6.25Z"
        stroke={props.stroke || '#FFE526'}
        strokeWidth={1.375}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.1875 7.625L10.8125 3.5"
        stroke={props.stroke || '#FFE526'}
        strokeWidth={1.375}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.3125 7.625L6.6875 3.5"
        stroke={props.stroke || '#FFE526'}
        strokeWidth={1.375}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_876_25306">
        <Rect
          width={16.5}
          height={16.5}
          fill="white"
          transform="translate(0.5 0.75)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);

export const EditProfileIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#clip0_876_25726)">
      <Path
        d="M8 7C8 8.06087 8.42143 9.07828 9.17157 9.82843C9.92172 10.5786 10.9391 11 12 11C13.0609 11 14.0783 10.5786 14.8284 9.82843C15.5786 9.07828 16 8.06087 16 7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7Z"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H13.5"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.42 15.6092C18.615 15.4142 18.8465 15.2595 19.1013 15.154C19.3561 15.0485 19.6292 14.9941 19.905 14.9941C20.1808 14.9941 20.4539 15.0485 20.7087 15.154C20.9635 15.2595 21.195 15.4142 21.39 15.6092C21.585 15.8043 21.7397 16.0358 21.8452 16.2906C21.9508 16.5454 22.0051 16.8185 22.0051 17.0942C22.0051 17.37 21.9508 17.6431 21.8452 17.8979C21.7397 18.1527 21.585 18.3842 21.39 18.5792L18 21.9992H15V18.9992L18.42 15.6092Z"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_876_25726">
        <Rect width={24} height={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
