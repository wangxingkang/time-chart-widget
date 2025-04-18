import type { BrushBehavior } from 'd3-brush';
import type { Selection } from 'd3-selection';
import type { RangeBrushProps } from './types';
import { brushX } from 'd3-brush';
import { select } from 'd3-selection';
import { isFunction } from 'es-toolkit/compat';
import React from 'react';
import { normalizeSliderValue } from '../../utils/data';
import { getHandlePath } from './utils';

export function RangeBrush(props: RangeBrushProps) {
  const {
    isRanged = true,
    range: [min, max],
    value: [val0, val1],
    step = 0,
    width,
    marks,
    onBrushStart,
    onBrushEnd,
    onMouseoverHandle,
    onMouseoutHandle,
  } = props;
  const rootContainer = React.useRef<SVGGElement>(null);
  const brushRef = React.useRef<BrushBehavior<any>>();
  const handleRef = React.useRef<Selection<SVGPathElement, { type: string }, SVGGElement | null, unknown> | undefined>(null);
  const [moving, setMoving] = React.useState(false);
  const [brushing, setBrushing] = React.useState(false);
  const [startSel, setStartSel] = React.useState<number[]>();
  const [lastSel, setLastSel] = React.useState<number[]>();

  const _invert = (x: number) => (x * (max - min)) / width + min;
  const _scale = (x: number) => ((x - min) * width) / (max - min);

  const _move = (val0 = 0, val1 = 0) => {
    const brush = brushRef.current;
    const handle = handleRef.current;
    const root = rootContainer.current ? select(rootContainer.current) : undefined;

    if (width && max - min && brush && handle) {
      if (!isRanged) {
        // only draw a 1 pixel line
        if (root)
          brush.move(root, [_scale(val0), _scale(val0) + 1]);
      }
      else {
        if (root)
          brush.move(root, [_scale(val0), _scale(val1)]);

        handle
          .attr('display', null)
          .attr('transform', (d, i) => `translate(${[i === 0 ? _scale(val0) : _scale(val1), 0]})`);
      }
    }
  };

  const _brushed = (evt: { sourceEvent: any; selection: number[] }) => {
    // Ignore brush events which don't have an underlying sourceEvent
    if (!evt.sourceEvent)
      return;
    const [sel0, sel1] = evt.selection;
    // const right = moveRight(startSel!, evt.selection);

    let d0 = _invert(sel0);
    let d1 = _invert(sel1);
    // this makes sure if points are right at the beginning of the domains are displayed correctly
    // the problem here is bisectLeftx
    d0 = d0 === min ? d0 : normalizeSliderValue(d0, min, step, marks);
    d1 = normalizeSliderValue(d1, min, step, marks);

    // eslint-disable-next-line no-console
    console.log(d0, d1);
  };

  const _click = (selection) => {
    // fake brush
    setBrushing(true);
    _brushed({ sourceEvent: {}, selection });
  };

  React.useEffect(
    () => {
      const root = rootContainer.current ? select(rootContainer.current) : undefined;
      brushRef.current = brushX()
        .handleSize(3)
        .on('start', (event) => {
          if (isFunction(onBrushStart))
            onBrushStart();
          setStartSel(event.selection);
        })
        .on('brush', (event) => {
          if (moving) {
            return;
          }
          if (event.selection) {
            setLastSel(event.selection);
            setBrushing(true);
            _brushed(event);
          }
        })
        .on('end', (event) => {
          if (!event.selection) {
            if (brushing) {
              // handle null selection
              _click(lastSel);
            }
            else if (startSel) {
              // handle click
              _click(startSel);
            }
          }

          if (isFunction(onBrushEnd))
            onBrushEnd();

          setBrushing(false);
          setMoving(false);
        });

      const brushResizePath = getHandlePath(props);

      handleRef.current = root
        ?.selectAll('.handle--custom')
        .data([{ type: 'w' }, { type: 'e' }])
        .enter()
        .append('path')
        .attr('class', 'handle--custom')
        .attr('display', isRanged ? null : 'none')
        .attr('fill', '#D3D8E0')
        .attr('cursor', 'ew-resize')
        .attr('d', brushResizePath)
        .on('mouseover', () => {
          if (isFunction(onMouseoverHandle))
            onMouseoverHandle();
        })
        .on('mouseout', () => {
          if (isFunction(onMouseoutHandle))
            onMouseoutHandle();
        });

      setMoving(true);
      _move(val0, val1);
    },
    [],
  );

  return (
    <g className="kg-range-slider__brush" ref={rootContainer} />
  );
}
