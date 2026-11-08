import { parseNumber, calculateDose } from './calculator.js';

const root = document.documentElement;
const themeButton = document.querySelector('#theme');
const preference = window.matchMedia('(prefers-color-scheme: dark)');
let savedTheme;
try { savedTheme = localStorage.getItem('vet-theme'); } catch {}
function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.textContent = theme === 'dark' ? '☀ Светлая тема' : '☾ Тёмная тема';
  themeButton.setAttribute('aria-label', `Включить ${theme === 'dark' ? 'светлую' : 'тёмную'} тему`);
}
setTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : preference.matches ? 'dark' : 'light');
themeButton.addEventListener('click', () => {
  savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(savedTheme);
  try { localStorage.setItem('vet-theme', savedTheme); } catch {}
});
preference.addEventListener('change', event => { if (!savedTheme) setTheme(event.matches ? 'dark' : 'light'); });

const form = document.querySelector('form');
const ids = ['weight', 'dose', 'concentration'];
const outputs = ['milligrams', 'milliliters'];
const formatter = new Intl.NumberFormat('ru-RU', { maximumSignificantDigits: 6 });
const scientific = new Intl.NumberFormat('ru-RU', { maximumSignificantDigits: 6, notation: 'scientific' });
function render() {
  let incomplete = false;
  let invalid = false;
  const values = ids.map(id => {
    const input = document.getElementById(id);
    const empty = input.value.trim() === '';
    const value = parseNumber(input.value);
    let error = '';
    if (empty) incomplete = true;
    else if (!Number.isFinite(value)) error = 'Введите корректное число, например 2,5.';
    else if (value < 0 || (id === 'concentration' && value === 0)) error = id === 'concentration' ? 'Концентрация должна быть больше нуля.' : 'Значение не может быть отрицательным.';
    input.setAttribute('aria-invalid', String(Boolean(error)));
    document.getElementById(`${id}-error`).textContent = error;
    invalid ||= Boolean(error);
    return value;
  });
  outputs.forEach(id => { document.getElementById(id).textContent = '—'; });
  const status = document.getElementById('status');
  status.textContent = invalid ? 'Исправьте отмеченные значения.' : 'Заполните три поля для расчёта.';
  if (invalid || incomplete) return;
  try {
    const result = calculateDose(...values);
    outputs.forEach(id => {
      const value = result[id];
      document.getElementById(id).textContent = (value !== 0 && (value < 0.0001 || value >= 1e9) ? scientific : formatter).format(value);
    });
    status.textContent = 'Результат обновляется автоматически.';
  } catch (error) { status.textContent = error.message; }
}
form.addEventListener('input', render);
form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('reset', () => setTimeout(render, 0));
