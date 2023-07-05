export const formNewTodo = (title: string) => {
  const USER_ID = 10858;

  return {
    title,
    userId: USER_ID,
    completed: false,
  };
};
