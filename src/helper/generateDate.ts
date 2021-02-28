export const generateDate = (): Date => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  date.setMonth(Math.floor(Math.random() * 12 + 1));
  date.setDate(Math.floor(Math.random() * 31 + 1));
  return date;
};
