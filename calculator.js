export function parseNumber(value) {
  const text = String(value).trim();
  if (!/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(text)) return NaN;
  return Number(text.replace(',', '.'));
}

export function calculateDose(weight, dose, concentration) {
  if (![weight, dose, concentration].every(Number.isFinite) ||
      weight < 0 || dose < 0 || concentration <= 0) {
    throw new RangeError('Введите неотрицательные массу и дозировку, концентрацию больше нуля.');
  }
  const milligrams = weight * dose;
  const milliliters = milligrams / concentration;
  if (![milligrams, milliliters].every(Number.isFinite) ||
      (weight > 0 && dose > 0 && (milligrams === 0 || milliliters === 0))) {
    throw new RangeError('Значения слишком велики или слишком малы для точного расчёта.');
  }
  return { milligrams, milliliters };
}
