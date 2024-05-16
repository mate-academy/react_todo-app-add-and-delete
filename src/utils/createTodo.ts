function generateId(): number {
  return Math.floor(Math.random() * 900000) + 100000;
}

export const createTodo = (title: string) => {
  const newTodo = {
    id: generateId(),
    userId: 645,
    title: title,
    completed: false,
  };

  return newTodo;
};
