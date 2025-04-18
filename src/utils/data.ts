import { isFinite } from 'es-toolkit/compat';
import { snapToMarks } from './plot';

/**
 * get number of decimals to round to for slider from step
 * @param step
 * @returns- number of decimal
 */
export function getRoundingDecimalFromStep(step: number): number {
  const stepStr = step.toString();

  // in case the step is a very small number e.g. 1e-7, return decimal e.g. 7 directly
  const splitExponential = stepStr.split('e-');

  if (splitExponential.length === 2) {
    const coeffZero = splitExponential[0].split('.');
    const coeffDecimal = coeffZero.length === 1 ? 0 : coeffZero[1].length;
    return Number.parseInt(splitExponential[1], 10) + coeffDecimal;
  }

  const splitZero = stepStr.split('.');
  if (splitZero.length === 1) {
    return 0;
  }
  return splitZero[1].length;
}

/**
 * round number with exact number of decimals
 * return as a string
 */
export function preciseRound(num: number, decimals: number): string {
  const t = 10 ** decimals;
  return (
    Math.round(
      num * t + (decimals > 0 ? 1 : 0) * (Math.sign(num) * (10 / 100 ** decimals)),
    ) / t
  ).toFixed(decimals);
}

/**
 * round the value to step for the slider
 * @param minValue
 * @param step
 * @param val
 * @returns - rounded number
 */
export function roundValToStep(minValue: number | undefined, step: number, val: number): number {
  if (!isFinite(step) || !isFinite(minValue)) {
    return val;
  }

  const decimal = getRoundingDecimalFromStep(step);
  const steps = Math.floor((val - minValue) / step);
  let remain = val - (steps * step + minValue);

  // has to round because javascript turns 0.1 into 0.9999999999999987
  remain = Number(preciseRound(remain, 8));

  let closest: number;
  if (remain === 0) {
    closest = val;
  }
  else if (remain < step / 2) {
    closest = steps * step + minValue;
  }
  else {
    closest = (steps + 1) * step + minValue;
  }

  // precise round return a string rounded to the defined decimal
  const rounded = preciseRound(closest, decimal);

  return Number(rounded);
}

/**
 * If marks is provided, snap to marks, if not normalize to step
 * @param val
 * @param minValue
 * @param step
 * @param marks
 */
export function normalizeSliderValue(
  val: number,
  minValue: number | undefined,
  step: number,
  marks?: number[] | null,
): number {
  if (marks && marks.length) {
    // Use in slider, given a number and an array of numbers, return the nears number from the array
    return snapToMarks(val, marks);
  }

  return roundValToStep(minValue, step, val);
}
