import * as React from 'react';
import Svg, {SvgProps, G, Rect, Defs} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
export const RoundButton = (props: SvgProps) => (
  <Svg
    width={101}
    height={35}
    viewBox="0 0 101 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G filter="url(#filter0_i_876_7770)">
      <Rect
        x={0.5}
        y={0.625}
        width={100}
        height={34}
        rx={17}
        fill="black"
        fillOpacity={0.12}
      />
      <Rect x={1} y={1.125} width={99} height={33} rx={16.5} stroke="#1AD655" />
    </G>
    <Defs></Defs>
  </Svg>
);
