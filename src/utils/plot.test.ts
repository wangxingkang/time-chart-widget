import { describe, expect, it } from 'vitest';
import { snapToMarks } from './plot';

describe('snapToMarks', () => {
  // 测试 marks 数组为空的情况
  it('should return null when marks array is empty', () => {
    const value = 10;
    const marks: number[] = [];
    const result = snapToMarks(value, marks);
    expect(result).toBeNull();
  });

  // 测试 value 小于 marks 数组第一个元素的情况
  it('should return the first mark when value is less than the first mark', () => {
    const value = 5;
    const marks = [10, 20, 30];
    const result = snapToMarks(value, marks);
    expect(result).toBe(10);
  });

  // 测试 value 大于 marks 数组最后一个元素的情况
  it('should return the last mark when value is greater than the last mark', () => {
    const value = 35;
    const marks = [10, 20, 30];
    const result = snapToMarks(value, marks);
    expect(result).toBe(30);
  });

  // 测试 value 更接近前一个 mark 的情况
  it('should return the previous mark when value is closer to the previous mark', () => {
    const value = 13;
    const marks = [10, 20, 30];
    const result = snapToMarks(value, marks);
    expect(result).toBe(10);
  });

  // 测试 value 更接近后一个 mark 的情况
  it('should return the next mark when value is closer to the next mark', () => {
    const value = 17;
    const marks = [10, 20, 30];
    const result = snapToMarks(value, marks);
    expect(result).toBe(20);
  });

  // 测试 value 正好等于某个 mark 的情况
  it('should return the exact mark when value is equal to a mark', () => {
    const value = 20;
    const marks = [10, 20, 30];
    const result = snapToMarks(value, marks);
    expect(result).toBe(20);
  });
});
