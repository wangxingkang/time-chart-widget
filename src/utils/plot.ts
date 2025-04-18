import { bisectLeft } from 'd3-array';

/**
 * Use in slider, given a number and an array of numbers, return the nears number from the array.
 * Takes a value, timesteps and return the actual step.
 * @param value
 * @param marks
 */
export function snapToMarks(value: number, marks: number[]): number {
  // always use bin x0
  if (!marks.length) {
    // @ts-expect-error looking at the usage null return value isn't expected and requires extra handling in a lot of places
    return null;
  }
  const i = bisectLeft(marks, value);
  if (i === 0) {
    return marks[i];
  }
  else if (i === marks.length) {
    return marks[i - 1];
  }
  const idx = marks[i] - value < value - marks[i - 1] ? i : i - 1;
  return marks[idx];
}
