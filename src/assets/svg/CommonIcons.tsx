import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  G,
  Rect,
  ClipPath,
  Defs,
  Polygon,
} from 'react-native-svg';
export const UserIcon = (props: SvgProps) => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
    <Path
      d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9Z"
      stroke="#CAC9CE"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.4426 16.5C15.4426 13.5975 12.5551 11.25 9.00011 11.25C5.44511 11.25 2.55762 13.5975 2.55762 16.5"
      stroke="#CAC9CE"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const InputCalendarIcon = (props: SvgProps) => (
  <Svg width={16} height={17} viewBox="0 0 16 17" fill="none" {...props}>
    <Path
      d="M1.72286 2.84229C1.4234 2.84229 1.13621 2.96125 0.924458 3.17299C0.712709 3.38474 0.59375 3.67193 0.59375 3.97139V14.6979C0.59375 14.9974 0.712709 15.2846 0.924458 15.4963C1.13621 15.708 1.4234 15.827 1.72286 15.827H14.143C14.4425 15.827 14.7297 15.708 14.9414 15.4963C15.1531 15.2846 15.2722 14.9974 15.2722 14.6979V3.97139C15.2722 3.67193 15.1531 3.38474 14.9414 3.17299C14.7297 2.96125 14.4425 2.84229 14.143 2.84229H11.8848"
      stroke="white"
      strokeWidth={1.12911}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M0.59375 6.79443H15.2722"
      stroke="white"
      strokeWidth={1.12911}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.98145 1.14893V4.53625"
      stroke="white"
      strokeWidth={1.12911}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.8848 1.14893V4.53625"
      stroke="white"
      strokeWidth={1.12911}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.98145 2.84229H9.62699"
      stroke="white"
      strokeWidth={1.12911}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PlusIcon = (props: SvgProps) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
    <Path
      d="M0 9.20223V6.79777H6.77505V0H9.22495V6.79777H16V9.20223H9.22495V16H6.77505V9.20223H0Z"
      fill={props.fill || 'white'}
    />
  </Svg>
);

export const RightArrowIcon = (props: SvgProps) => (
  <Svg
    width="22px"
    height="22px"
    fill="#ffffff"
    viewBox="0 0 700 600"
    data-name="Layer 1"
    id="Layer_1"
    {...props}>
    <Polygon points="150.46 478 129.86 456.5 339.11 256 129.86 55.49 150.46 34 382.14 256 150.46 478" />
  </Svg>
);

export const BottomArrowIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" transform="rotate(90)" {...props}>
    <G id="SVGRepo_bgCarrier" strokeWidth={0} />
    <G
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <G id="SVGRepo_iconCarrier">
      <Path
        d="M10 7L15 12L10 17"
        stroke="#ffffff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);
export const TopArrowIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" transform="rotate(270)" {...props}>
    <G id="SVGRepo_bgCarrier" strokeWidth={0} />
    <G
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <G id="SVGRepo_iconCarrier">
      <Path
        d="M10 7L15 12L10 17"
        stroke="#ffffff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

export const CrossIconSimple = (props: SvgProps) => (
  <Svg width={34} height={33} viewBox="0 0 34 33" fill="none" {...props}>
    <G clipPath="url(#clip0_876_14120)">
      <Path
        d="M25.5937 8.28125L9.15625 24.7187"
        stroke="white"
        strokeWidth={2.73958}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.15625 8.28125L25.5937 24.7187"
        stroke="white"
        strokeWidth={2.73958}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_876_14120">
        <Rect
          width={32.875}
          height={32.875}
          fill="white"
          transform="translate(0.9375 0.0625)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);

export const RightIcon = (props: any) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect width={48} height={48} fill="white" fillOpacity={0.01} />
    <Path
      d="M19 12L31 24L19 36"
      stroke={props.color}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CrossIconSimple2 = (props: SvgProps) => (
  <Svg
    fill={props.color}
    width={props.width || '15px'}
    height={props.height || '15px'}
    viewBox="0 0 15 15"
    id="cross"
    {...props}>
    <Path
      fill={props.color}
      d="M2.64,1.27L7.5,6.13l4.84-4.84C12.5114,1.1076,12.7497,1.0029,13,1c0.5523,0,1,0.4477,1,1&#xA;&#x9;c0.0047,0.2478-0.093,0.4866-0.27,0.66L8.84,7.5l4.89,4.89c0.1648,0.1612,0.2615,0.3796,0.27,0.61c0,0.5523-0.4477,1-1,1&#xA;&#x9;c-0.2577,0.0107-0.508-0.0873-0.69-0.27L7.5,8.87l-4.85,4.85C2.4793,13.8963,2.2453,13.9971,2,14c-0.5523,0-1-0.4477-1-1&#xA;&#x9;c-0.0047-0.2478,0.093-0.4866,0.27-0.66L6.16,7.5L1.27,2.61C1.1052,2.4488,1.0085,2.2304,1,2c0-0.5523,0.4477-1,1-1&#xA;&#x9;C2.2404,1.0029,2.4701,1.0998,2.64,1.27z"
    />
  </Svg>
);

export const ResentIcon = (props: SvgProps) => (
  <Svg width={20} height={21} viewBox="0 0 20 21" fill="none" {...props}>
    <Path
      d="M3.38928 11.1911C3.54664 12.3911 4.02768 13.5256 4.78081 14.4729C5.53393 15.4203 6.53074 16.1448 7.66431 16.5686C8.79788 16.9925 10.0255 17.0999 11.2154 16.8791C12.4053 16.6584 13.5127 16.1178 14.4188 15.3156C15.3249 14.5133 15.9955 13.4795 16.3587 12.325C16.7219 11.1705 16.764 9.939 16.4805 8.76245C16.197 7.58589 15.5985 6.50871 14.7493 5.64642C13.9001 4.78414 12.8322 4.16928 11.6601 3.86779C8.41094 3.03446 5.04761 4.70696 3.80594 7.82363M3.33339 3.65697V7.82364H7.50006"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ViewIcon = (props: SvgProps) => (
  <Svg width={12} height={13} viewBox="0 0 12 13" fill="none" {...props}>
    <Path
      d="M0.912109 6.88891C2.94752 2.3658 9.05364 2.3658 11.089 6.88891"
      stroke="#FAFAFA"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.00086 9.1506C5.06406 9.1506 4.30469 8.39122 4.30469 7.45443C4.30469 6.51763 5.06406 5.7583 6.00086 5.7583C6.93766 5.7583 7.69703 6.51763 7.69703 7.45443C7.69703 8.39122 6.93766 9.1506 6.00086 9.1506Z"
      stroke="#FAFAFA"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MoreIcon = (props: SvgProps) => (
  <Svg width={14} height={4} viewBox="0 0 14 4" fill="none" {...props}>
    <Path
      d="M0.25 2.375C0.25 1.55 0.925 0.875 1.75 0.875C2.575 0.875 3.25 1.55 3.25 2.375C3.25 3.2 2.575 3.875 1.75 3.875C0.925 3.875 0.25 3.2 0.25 2.375ZM7 3.875C7.825 3.875 8.5 3.2 8.5 2.375C8.5 1.55 7.825 0.875 7 0.875C6.175 0.875 5.5 1.55 5.5 2.375C5.5 3.2 6.175 3.875 7 3.875ZM12.25 3.875C13.075 3.875 13.75 3.2 13.75 2.375C13.75 1.55 13.075 0.875 12.25 0.875C11.425 0.875 10.75 1.55 10.75 2.375C10.75 3.2 11.425 3.875 12.25 3.875Z"
      fill="#E5E5E5"
    />
  </Svg>
);

export const CommentIcon = (props: SvgProps) => (
  <Svg width={19} height={19} viewBox="0 0 19 19" fill="none" {...props}>
    <Path
      d="M3.24536 15.6933C2.86719 15.7738 2.5447 15.4129 2.66697 15.0462L3.28765 13.1841C3.33681 13.0366 3.31339 12.8753 3.2318 12.743C2.4913 11.5421 2.23401 10.1495 2.50779 8.79691C2.79746 7.36582 3.66192 6.07694 4.94045 5.16989C6.21898 4.26284 7.82457 3.79935 9.45869 3.86561C11.0928 3.93187 12.6443 4.52336 13.8246 5.5301C15.0049 6.53685 15.7338 7.89034 15.8757 9.33892C16.0176 10.7875 15.5628 12.2326 14.596 13.4055C13.6292 14.5785 12.2161 15.3994 10.6195 15.7157C9.08009 16.0207 7.47108 15.8365 6.07099 15.1983C5.96973 15.1521 5.85652 15.1378 5.74767 15.1609L3.24536 15.6933Z"
      stroke="#CAC9CE"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ShareIcon = (props: SvgProps) => (
  <Svg width={19} height={19} viewBox="0 0 19 19" fill="none" {...props}>
    <Path
      d="M10.72 4.6006C10.3967 4.31772 9.89077 4.5473 9.89077 4.97688V6.4471C9.89077 6.69342 9.71051 6.90157 9.4692 6.951C4.854 7.8964 3.10444 12.0794 2.39077 15.875C2.36435 16.0221 6.04795 11.8365 9.38867 11.4098C9.66418 11.3746 9.89077 11.6014 9.89077 11.8791V13.2731C9.89077 13.7027 10.3967 13.9323 10.72 13.6494L15.4607 9.50129C15.6884 9.30208 15.6884 8.94792 15.4607 8.74871L10.72 4.6006Z"
      stroke="#CAC9CE"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const LikeIcon = (props: SvgProps) => (
  <Svg width={18} height={19} viewBox="0 0 18 19" fill="none" {...props}>
    <Path
      d="M14.625 10.3047L9.49256 15.3879C9.21975 15.6581 8.78021 15.6581 8.5074 15.3879L3.37498 10.3047C3.00396 9.9437 2.71171 9.50975 2.51664 9.03022C2.32157 8.55069 2.2279 8.03596 2.24153 7.51844C2.25517 7.00093 2.3758 6.49184 2.59585 6.02325C2.8159 5.55465 3.13058 5.13668 3.5201 4.79568C3.90961 4.45467 4.36551 4.19801 4.85909 4.04185C5.35267 3.8857 5.87324 3.83343 6.38801 3.88834C6.90278 3.94326 7.40061 4.10416 7.85014 4.36092C8.02759 4.46228 8.196 4.57771 8.35386 4.70587C8.71686 5.00058 9.28521 5.00216 9.64985 4.70947C9.80717 4.58319 9.97482 4.4695 10.1513 4.3697C10.6005 4.11566 11.0974 3.95708 11.6107 3.90388C12.124 3.85069 12.6428 3.90402 13.1346 4.06054C13.6263 4.21706 14.0805 4.4734 14.4686 4.81352C14.8568 5.15363 15.1706 5.57021 15.3903 6.03716C15.61 6.50412 15.731 7.01141 15.7457 7.52727C15.7604 8.04314 15.6684 8.55649 15.4756 9.03518C15.2827 9.51387 14.9932 9.94761 14.625 10.3092"
      fill="#FE2C55"
    />
    <Path
      d="M14.625 10.3047L9.49256 15.3879C9.21975 15.6581 8.78021 15.6581 8.5074 15.3879L3.37498 10.3047C3.00396 9.9437 2.71171 9.50975 2.51664 9.03022C2.32157 8.55069 2.2279 8.03596 2.24153 7.51844C2.25517 7.00093 2.3758 6.49185 2.59585 6.02325C2.8159 5.55465 3.13058 5.13668 3.5201 4.79568C3.90961 4.45467 4.36551 4.19801 4.85909 4.04185C5.35267 3.8857 5.87324 3.83343 6.38801 3.88834C6.90278 3.94326 7.40061 4.10416 7.85014 4.36092C8.02759 4.46228 8.196 4.57771 8.35386 4.70587C8.71686 5.00058 9.28521 5.00216 9.64985 4.70947C9.80717 4.58319 9.97482 4.4695 10.1513 4.3697C10.6005 4.11566 11.0974 3.95708 11.6107 3.90388C12.124 3.85069 12.6428 3.90402 13.1346 4.06054C13.6263 4.21706 14.0805 4.4734 14.4686 4.81352C14.8568 5.15363 15.1706 5.57021 15.3903 6.03716C15.61 6.50412 15.731 7.01141 15.7457 7.52727C15.7604 8.04314 15.6684 8.55649 15.4756 9.03518C15.2827 9.51387 14.9932 9.94761 14.625 10.3092"
      stroke="#FE2C55"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const EditIcon = (props: SvgProps) => (
  <Svg
    fill={props.fill || '#929292'}
    viewBox="0 0 16 16"
    width={24}
    height={24}
    {...props}>
    <Path d="M15.49 7.3h-1.16v6.35H1.67V3.28H8V2H1.67A1.21 1.21 0 0 0 .5 3.28v10.37a1.21 1.21 0 0 0 1.17 1.25h12.66a1.21 1.21 0 0 0 1.17-1.25z" />
    <Path d="M10.56 2.87 6.22 7.22l-.44.44-.08.08-1.52 3.16a1.08 1.08 0 0 0 1.45 1.45l3.14-1.53.53-.53.43-.43 4.34-4.36.45-.44.25-.25a2.18 2.18 0 0 0 0-3.08 2.17 2.17 0 0 0-1.53-.63 2.19 2.19 0 0 0-1.54.63l-.7.69-.45.44zM5.51 11l1.18-2.43 1.25 1.26zm2-3.36 3.9-3.91 1.3 1.31L8.85 9zm5.68-5.31a.91.91 0 0 1 .65.27.93.93 0 0 1 0 1.31l-.25.24-1.3-1.3.25-.25a.88.88 0 0 1 .69-.25z" />
  </Svg>
);

export const ArrowIcon = (props: any) => (
  <Svg
    width={props?.width || 20}
    height={props?.height || 20}
    // viewBox="0 0 24 24"
    fill={props?.fill}
    viewBox="0 -6 524 524"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path d="M64 191L98 157 262 320 426 157 460 191 262 387 64 191Z" />
  </Svg>
);
