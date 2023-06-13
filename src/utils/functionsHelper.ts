export const getTodoId = () => {
  const randomNumber = Math.random()
    .toString()
    .slice(-5);

  return +randomNumber;
};
