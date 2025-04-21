import React from 'react';

export interface BarProps extends React.SVGProps<SVGRectElement> {
  /** 是否在范围内 */
  inRange: boolean;
  /** 是否为覆盖层 */
  isOverlay: boolean;
  /** 条形的颜色 */
  color?: string;
}

function BarUnmemoized(props) {
  const { inRange, isOverlay, color, ...rest } = props;

  return (
    <rect {...rest} />
  );
}

export const Bar = React.memo(BarUnmemoized);
