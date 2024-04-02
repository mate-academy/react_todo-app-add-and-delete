import { Todo } from '../types/Todo';
import React from 'react';
import { TodoItem } from './TodoItems';

interface Props {
  preparedTodos: Todo[];
  setTodos: (value: Todo[]) => void;
  handleError: (value: string) => void;
  tempTodo: Todo | null;
  focusInput: () => void;
}

export const Todos: React.FC<Props> = ({
  preparedTodos,
  setTodos,
  handleError,
  tempTodo,
  focusInput,
}) => {
  return (
    <>
      {preparedTodos.map((todo: Todo) => (
        <TodoItem
          todo={todo}
          preparedTodos={preparedTodos}
          setTodos={setTodos}
          handleError={handleError}
          key={todo.id}
          focusInput={focusInput}
          todos={preparedTodos}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          preparedTodos={preparedTodos}
          setTodos={setTodos}
          handleError={handleError}
          key={tempTodo.id}
          focusInput={focusInput}
          todos={preparedTodos}
        />
      )}
    </>
  );
};
