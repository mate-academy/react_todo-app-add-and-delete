export const createTodo = (title: string) => {
  const newTodo = {
    id: 0,
    userId: 645,
    title: title,
    completed: false,
  };

  return newTodo;
};
