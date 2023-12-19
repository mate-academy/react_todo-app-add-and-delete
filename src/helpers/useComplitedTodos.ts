import { useTodosContext } from '../components/store';

export const useCompletedTodos = () => {
  const { todos } = useTodosContext();

  return (
    todos.filter((todo) => todo.completed)
  );
};
