import type { ReactElement } from 'react';
import type { Bins } from '../../types';

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface HistogramPlotProps {
  width: number;
  height: number;
  margin: Margin;
  isRanged?: boolean;
  value: number[];
  isMasked?: number;
  brushComponent?: ReactElement;
  histogramsByGroup: Bins;
  colorsByGroup?: null | { [dataId: string]: string };
  countProp?: string;
  range?: number[];
  breakLines?: number[];
}
