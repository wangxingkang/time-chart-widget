import type { HistogramPlotProps } from './types';
import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import React from 'react';
import { HISTOGRAM_MASK_MODE } from '../../config';
import { Bar } from './Bar';
import { isBarInRange } from './utils';

const histogramStyle = {
  highlightW: 0.7,
  unHighlightedW: 0.4,
};
const HISTOGRAM_MASK_BGCOLOR = '#FFFFFF';
const HISTOGRAM_MASK_FGCOLOR = '#000000';

export function HistogramPlot(props: HistogramPlotProps) {
  const {
    width,
    height,
    histogramsByGroup,
    colorsByGroup,
    countProp = 'count',
    margin,
    isRanged,
    range,
    value,
    brushComponent,
    breakLines,
    isMasked = HISTOGRAM_MASK_MODE.NoMask,
  } = props;

  const undefinedToZero = (x: number | undefined) => (x || 0);
  const groupKeys = React.useMemo(
    () =>
      Object.keys(histogramsByGroup)
        // only keep non-empty groups
        .filter(key => histogramsByGroup[key]?.length > 0),
    [histogramsByGroup],
  );

  const domain = React.useMemo(
    () =>
      range ?? [
        min(groupKeys, key => histogramsByGroup[key][0].x0) ?? 0,
        max(groupKeys, key => histogramsByGroup[key][histogramsByGroup[key].length - 1].x1) ?? 0,
      ],
    [range, histogramsByGroup, groupKeys],
  );

  const barWidth = React.useMemo(() => {
    if (groupKeys.length === 0)
      return 0;
    // find histogramsByGroup with max number of bins
    const maxGroup = groupKeys.reduce((accu, key, _idx) => {
      if (histogramsByGroup[key].length > accu.length) {
        return histogramsByGroup[key];
      }
      return accu;
    }, histogramsByGroup[groupKeys[0]]);

    // find the bin for measuring step
    const stdBinIdx = maxGroup.length > 1 ? 1 : 0;
    const xStep = maxGroup[stdBinIdx].x1 - maxGroup[stdBinIdx].x0;
    const maxBins = (domain[1] - domain[0]) / xStep;
    if (!maxBins)
      return 0;
    return width / maxBins / (isMasked ? 1 : groupKeys.length);
  }, [histogramsByGroup, domain, groupKeys, width, isMasked]);

  const x = React.useMemo(
    () => scaleLinear().domain(domain).range([barWidth, width]),
    [domain, width, barWidth],
  );

  const y = React.useMemo(
    () =>
      scaleLinear()
        .domain([
          0,
          Math.max(
            Number(max(groupKeys, key => max(histogramsByGroup[key], d => d[countProp]))),
            1,
          ),
        ])
        .range([0, height]),
    [histogramsByGroup, groupKeys, height, countProp],
  );

  if (groupKeys.length === 0) {
    return null;
  }

  const maskedHistogram = () => {
    return (
      <svg
        width={width}
        height={height}
        style={{
          margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
        }}
      >
        <defs>
          <mask id="histogram-mask">
            <rect
              x="0"
              y="0"
              width={width}
              height={height + margin.bottom}
              fill={HISTOGRAM_MASK_BGCOLOR}
            />
            <g key="filtered-bins" className="histogram-bars">
              {histogramsByGroup.filteredBins.map((bar, idx, list) => {
                const inRange = isBarInRange(bar, idx, list, domain, value);
                const wRatio = inRange
                  ? histogramStyle.highlightW
                  : histogramStyle.unHighlightedW;
                return (
                  <Bar
                    $isOverlay={false}
                    $inRange={inRange}
                    $color={HISTOGRAM_MASK_FGCOLOR}
                    // eslint-disable-next-line react/no-array-index-key
                    key={`mask-${idx}`}
                    height={y(bar[countProp])}
                    width={barWidth * wRatio}
                    x={x(bar.x0) + (barWidth * (1 - wRatio)) / 2}
                    y={height - y(bar[countProp])}
                  />
                );
              })}
            </g>
          </mask>
        </defs>
        <g transform="translate(0,0)">
          <rect
            x="0"
            y="0"
            width="100%"
            height={height + margin.bottom}
            mask="url(#histogram-mask)"
          />
        </g>
        {isMasked === HISTOGRAM_MASK_MODE.MaskWithOverlay && (
          <g key="bins" transform="translate(0,0)" className="overlay-histogram-bars">
            {histogramsByGroup.bins.map((bar, idx, list) => {
              const filterBar = histogramsByGroup.filteredBins[idx];

              const maskHeight = filterBar
                ? y(bar[countProp]) - y(filterBar[countProp])
                : y(bar[countProp]);

              const inRange = isBarInRange(bar, idx, list, domain, value);
              const wRatio = inRange ? histogramStyle.highlightW : histogramStyle.unHighlightedW;

              return (
                <Bar
                  $inRange={inRange}
                  $isOverlay={true}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`bar-${idx}`}
                  height={maskHeight}
                  width={barWidth * wRatio}
                  x={x(bar.x0) + (barWidth * (1 - wRatio)) / 2}
                  y={height - y(bar[countProp])}
                />
              );
            })}
          </g>
        )}
        <g>
          {(breakLines ?? []).map((pos, idx) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <path key={`mask-line-${idx}`} strokeDasharray="4,4" d={`M${pos}, 0 l0 100`} />
            );
          })}
        </g>
        <g transform={`translate(${isRanged ? 0 : barWidth / 2}, 0)`}>{brushComponent}</g>
      </svg>
    );
  };

  return isMasked
    ? (
        maskedHistogram()
      )
    : (
        <svg
          width={width}
          height={height}
          style={{ margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px` }}
        >
          <g>
            {groupKeys.map((key, i) => (
              <g key={key} className="histogram-bars">
                {histogramsByGroup[key].map((bar, idx, list) => {
                  const inRange = isBarInRange(bar, idx, list, domain, value);

                  const wRatio = inRange ? histogramStyle.highlightW : histogramStyle.unHighlightedW;
                  const startX
                    = x(undefinedToZero(bar.x0)) + barWidth * i + (barWidth * (1 - wRatio)) / 2;

                  if (startX > 0 && startX + barWidth * histogramStyle.unHighlightedW <= width) {
                    return (
                      <Bar
                        $isOverlay={false}
                        $inRange={inRange}
                        $color={colorsByGroup?.[key]}
                        // eslint-disable-next-line react/no-array-index-key
                        key={`bar-${idx}`}
                        height={y(bar[countProp])}
                        width={barWidth * wRatio}
                        x={startX}
                        rx={1}
                        ry={1}
                        y={height - y(bar[countProp])}
                      />
                    );
                  }
                  return null;
                })}
              </g>
            ))}
          </g>
        </svg>
      );
}
