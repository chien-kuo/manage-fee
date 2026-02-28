export const HOUSE_NUMBERS = [
  1, 3, 5, 7, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29,
  2, 6, 8, 10, 12, 16, 18, 20, 22, 26, 28, 30, 32, 36, 38
];

export const ODD_HOUSES = HOUSE_NUMBERS.filter(n => n % 2 !== 0).sort((a, b) => a - b);
export const EVEN_HOUSES = HOUSE_NUMBERS.filter(n => n % 2 === 0).sort((a, b) => a - b);
