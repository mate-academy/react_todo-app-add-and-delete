/* eslint-disable prettier/prettier */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<
  React.SetStateAction<{ hasError: boolean; message: string }>
  >;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  isLoading,
  setTodos,
  setError,
  setIsLoading,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        setTodos={setTodos}
        setError={setError}
        setIsLoading={setIsLoading}
      />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        setTodos={setTodos}
        setError={setError}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    )}
  </section>
);
