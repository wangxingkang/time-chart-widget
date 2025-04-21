import type { Bins } from '../../types';
import type { OnBrush } from '../RangeBrush/types';

export interface RangePlotProps {
  isRanged?: boolean;
  timeFormat?: string;
  bins?: Bins;
  onBrush: OnBrush;
}
