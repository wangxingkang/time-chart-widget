import { describe, expect, it } from 'vitest';
import { getRoundingDecimalFromStep, normalizeSliderValue, preciseRound, roundValToStep } from './data';

describe('getRoundingDecimalFromStep', () => {
  // 测试输入为整数的情况
  it('should return 0 for an integer step', () => {
    const step = 5;
    const result = getRoundingDecimalFromStep(step);
    expect(result).toBe(0);
  });

  // 测试输入为一位小数的情况
  it('should return the correct number of decimals for a single decimal step', () => {
    const step = 0.1;
    const result = getRoundingDecimalFromStep(step);
    expect(result).toBe(1);
  });

  // 测试输入为多位小数的情况
  it('should return the correct number of decimals for a multi - decimal step', () => {
    const step = 0.00123;
    const result = getRoundingDecimalFromStep(step);
    expect(result).toBe(5);
  });

  // 测试输入为科学计数法表示的小数，且系数部分无小数的情况
  it('should return the correct number of decimals for a scientific notation step with no decimal in coefficient', () => {
    const step = 1e-7;
    const result = getRoundingDecimalFromStep(step);
    expect(result).toBe(7);
  });

  // 测试输入为科学计数法表示的小数，且系数部分有小数的情况
  it('should return the correct number of decimals for a scientific notation step with decimal in coefficient', () => {
    const step = 1.23e-5;
    const result = getRoundingDecimalFromStep(step);
    expect(result).toBe(7);
  });
});

describe('preciseRound', () => {
  // 测试正数保留不同小数位数的情况
  it('should round a positive number to the specified number of decimals', () => {
    const num = 3.14159;
    const decimals = 2;
    const result = preciseRound(num, decimals);
    expect(result).toBe('3.14');
  });

  // 测试负数保留不同小数位数的情况
  it('should round a negative number to the specified number of decimals', () => {
    const num = -2.71828;
    const decimals = 3;
    const result = preciseRound(num, decimals);
    expect(result).toBe('-2.718');
  });

  // 测试保留 0 位小数的情况
  it('should round to 0 decimals correctly', () => {
    const num = 5.6;
    const decimals = 0;
    const result = preciseRound(num, decimals);
    expect(result).toBe('6');
  });

  // 测试输入为整数的情况
  it('should return the integer as a string with specified decimals when input is an integer', () => {
    const num = 10;
    const decimals = 2;
    const result = preciseRound(num, decimals);
    expect(result).toBe('10.00');
  });

  // 测试输入为 0 的情况
  it('should return 0 as a string with specified decimals when input is 0', () => {
    const num = 0;
    const decimals = 3;
    const result = preciseRound(num, decimals);
    expect(result).toBe('0.000');
  });
});

describe('roundValToStep', () => {
  // 测试 step 或 minValue 不是数字的情况
  it('should return the original value when step or minValue is not a number', () => {
    const val = 10;
    const result1 = roundValToStep(undefined, Number.NaN, val);
    const result2 = roundValToStep(Number.NaN, 1, val);
    expect(result1).toBe(val);
    expect(result2).toBe(val);
  });

  // 测试余数为 0 的情况
  it('should return the original value when the remainder is 0', () => {
    const minValue = 0;
    const step = 2;
    const val = 4;
    const result = roundValToStep(minValue, step, val);
    expect(result).toBe(val);
  });

  // 测试余数小于 step/2 的情况
  it('should round down when the remainder is less than step/2', () => {
    const minValue = 0;
    const step = 2;
    const val = 5;
    const expected = 6;
    const result = roundValToStep(minValue, step, val);
    expect(result).toBe(expected);
  });

  // 测试余数大于等于 step/2 的情况
  it('should round up when the remainder is greater than or equal to step/2', () => {
    const minValue = 0;
    const step = 2;
    const val = 7;
    const expected = 8;
    const result = roundValToStep(minValue, step, val);
    expect(result).toBe(expected);
  });

  // 测试小数步长的情况
  it('should handle decimal steps correctly', () => {
    const minValue = 0;
    const step = 0.1;
    const val = 0.23;
    const expected = 0.2;
    const result = roundValToStep(minValue, step, val);
    expect(result).toBe(expected);
  });
});

describe('normalizeSliderValue', () => {
  // 测试提供 marks 数组的情况
  it('should call snapToMarks when marks are provided', () => {
    const val = 23;
    const minValue = 0;
    const step = 1;
    const marks = [10, 20, 30];
    const expectedResult = 20;

    const result = normalizeSliderValue(val, minValue, step, marks);

    expect(result).toBe(expectedResult);
  });

  // 测试不提供 marks 数组的情况
  it('should call roundValToStep when marks are not provided', () => {
    const val = 23;
    const minValue = 0;
    const step = 2;
    const expectedResult = 24;

    const result = normalizeSliderValue(val, minValue, step, null);
    expect(result).toBe(expectedResult);
  });
});
