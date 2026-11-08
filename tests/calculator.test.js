import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDose, parseNumber } from '../calculator.js';

test('5 кг × 10 мг/кг = 50 мг; 50 мг ÷ 50 мг/мл = 1 мл', () => {
  assert.deepEqual(calculateDose(5, 10, 50), { milligrams: 50, milliliters: 1 });
});
test('дробные значения', () => {
  const result = calculateDose(2.5, 0.3, 4);
  assert.equal(result.milligrams, 0.75);
  assert.equal(result.milliliters, 0.1875);
});
test('нулевая масса или дозировка дают нулевой результат', () => {
  for (const args of [[0, 10, 50], [5, 0, 50]]) {
    assert.deepEqual(calculateDose(...args), { milligrams: 0, milliliters: 0 });
  }
});
test('отрицательные, нулевая концентрация и нечисловые значения запрещены', () => {
  for (const args of [[-1, 2, 3], [1, -2, 3], [1, 2, -3], [1, 2, 0], [NaN, 2, 3], [1, Infinity, 3], [1, 2, '3']]) {
    assert.throws(() => calculateDose(...args), RangeError);
  }
});
test('переполнение и потеря малых значений не дают ложного результата', () => {
  for (const args of [[1e308, 10, 1], [1, 1, Number.MIN_VALUE], [Number.MIN_VALUE, 0.1, 1], [1, Number.MIN_VALUE, 10]]) {
    assert.throws(() => calculateDose(...args), RangeError);
  }
});
test('ввод с точкой или запятой и пробелами по краям', () => {
  for (const text of ['2.5', '2,5', ' 2,5 ']) assert.equal(parseNumber(text), 2.5);
  assert.equal(parseNumber(',5'), 0.5);
  assert.equal(parseNumber('0'), 0);
});
test('пустой, отрицательный и некорректный ввод отклоняется', () => {
  for (const text of ['', ' ', '-1', 'abc', '2мг', '1,2.3', 'Infinity', '1e3', '0x10', '1 000']) {
    assert.ok(Number.isNaN(parseNumber(text)), text);
  }
});
