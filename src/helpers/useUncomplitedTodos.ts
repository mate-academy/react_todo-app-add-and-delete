import { useTodosContext } from '../components/store';

export const useUncompletedTodos = () => {
  const { todos } = useTodosContext();

  return (
    todos.filter((todo) => !todo.completed)
  );
};
