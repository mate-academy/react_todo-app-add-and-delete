import {
  FC, ReactNode, memo, useMemo, useState,
} from 'react';
import { TodoContext, TodoContextProps } from './todoContext';
import { Todo } from '../../types/Todo';

interface Props {
  children: ReactNode,
}

export const TodoContextProvider: FC<Props> = memo(({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [removingTodoIds, setRemovingTodoIds] = useState<number[]>([]);

  const addTodo = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
  };

  const removeTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const removeCompletedTodos = (ids: number[]) => {
    setTodos(prevTodos => prevTodos.filter(todo => !ids.includes(todo.id)));
  };

  const size = useMemo(() => todos.length, [todos]);
  const countCompleted = useMemo(() => todos
    .filter(todo => todo.completed).length, [todos]);

  const value: TodoContextProps = useMemo(() => ({
    todos,
    size,
    countCompleted,
    setTodos,
    addTodo,
    removeTodo,
    removeCompletedTodos,
    removingTodoIds,
    setRemovingTodoIds,
  }), [addTodo, todos]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
});
