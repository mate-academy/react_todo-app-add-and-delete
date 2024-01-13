import { useMemo } from 'react';
import { ShowTodos } from '../../types/StatusTodo';
import { Todo } from '../../types/Todo';

// export const useActiveTodos = (todos: Todo[]) => {
//   const activeTodos = useMemo(
//     () => todos.filter(todo => !todo.completed),
//     [todos],
//   );

//   return activeTodos;
// };

// export const useComplitedTodos = (todos: Todo[]) => {
//   const complitedTodos = useMemo(
//     () => todos.filter(todo => todo.completed),
//     [todos],
//   );

//   return complitedTodos;
// };

export const useTodos = (todos: Todo[], selectedTodos: ShowTodos) => {
  // const activeTodos = useActiveTodos(todos);
  // const complitedTodos = useComplitedTodos(todos);

  const filteredTodos = useMemo(() => {
    switch (selectedTodos) {
      case ShowTodos.Active:
        return todos.filter(todo => !todo.completed);

      case ShowTodos.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, selectedTodos]);

  return filteredTodos;
};
