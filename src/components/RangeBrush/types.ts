export type OnBrush = (val0: number, val1: number) => void;

export interface RangeBrushProps {
  /**
   * 是否启用范围选择
   * @default true
   */
  isRanged?: boolean;
  /** 滑块取值范围 */
  range: [number, number];
  /** 当前滑块的取值 */
  value: [number, number];
  width: number;
  height: number;
  /**
   * 滑动的步长
   * @default 0
   */
  step?: number;
  /** 标记 */
  marks?: number[];
  /** 开始拖动滑块回调 */
  onBrushStart: () => void;
  /** 结束拖动滑块回调 */
  onBrushEnd: () => void;
  /** 滑块的值变化时回调 */
  onBrush: () => void;
  /** 鼠标悬停滑块手柄回调 */
  onMouseoverHandle: () => void;
  /** 鼠标离开滑块手柄回调 */
  onMouseoutHandle: () => void;
}
