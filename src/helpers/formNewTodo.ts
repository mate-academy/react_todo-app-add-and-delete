export const formNewTodo = (title: string) => {
  const USER_ID = 10926;

  return {
    title,
    userId: USER_ID,
    completed: false,
  };
};
