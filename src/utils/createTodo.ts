export const createTodo = (title: string) => {
  const newTodo = {
    id: new Date().getTime(),
    userId: 620,
    title: title,
    completed: false,
  };

  return newTodo;
};
