const getBase = (input = 0) => {
  try {
    return input.toString().split('.')[1].length;
  } catch (error) {
    return 0;
  }
};

export const add = (num1 = 0, num2 = 0) => {
  const base1 = getBase(num1);
  const base2 = getBase(num2);
  const base = Math.pow(10, Math.max(base1, base2));

  return (num1 * base + num2 * base) / base;
}

export const sub = (num1 = 0, num2 = 0) => {
  const base1 = getBase(num1);
  const base2 = getBase(num2);
  const base = Math.pow(10, Math.max(base1, base2));
  const precision = (base1 >= base2) ? base1 : base2;

  return Number(((num1 * base - num2 * base) / base).toFixed(precision));
}

export const mul = (num1 = 0, num2 = 0) => {
  const base1 = getBase(num1);
  const base2 = getBase(num2);
  const base = base1 + base2;

  return Number(num1.toString().replace('.', '')) * Number(num2.toString().replace('.', '')) / Math.pow(10, base);
}

export const div = (num1 = 0, num2 = 0) => {
  const base1 = getBase(num1);
  const base2 = getBase(num2);
  const base = base2 - base1;

  return Number(num1.toString().replace('.', '')) / Number(num2.toString().replace('.', '')) * Math.pow(10, base);
}
