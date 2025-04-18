import type { RangeBrushProps } from './types';

export function moveRight(startSel: number[], selection: number[]) {
  const [startSel0] = startSel;
  const [sel0] = selection;

  return Boolean(startSel0 === sel0);
}

// style brush resize handle
// https://github.com/crossfilter/crossfilter/blob/gh-pages/index.html#L466
export function getHandlePath(props: RangeBrushProps) {
  return function brushResizePath(d) {
    const e = Number(d.type === 'e');
    const x = e ? 1 : -1;
    const h = 39;
    const w = 4.5;
    const y = (props.height - h) / 2;
    return `M${0.5 * x},${y}c${2.5 * x},0,${w * x},2,${w * x},${w}v${h - w * 2}c0,2.5,${
      -2 * x
    },${w},${-w * x},${w}V${y}z`;
  };
};
