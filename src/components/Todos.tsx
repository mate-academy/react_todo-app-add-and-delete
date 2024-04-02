import { Todo } from '../types/Todo';
import React from 'react';
import { TodoItem } from './TodoItems';
import { useTodosContext } from '../context/TodoContext';

interface Props {
  focusInput: () => void;
}

export const Todos: React.FC<Props> = ({ focusInput }) => {
  const { tempTodo, preparedTodos } = useTodosContext();

  return (
    <>
      {preparedTodos.map((todo: Todo) => (
        <TodoItem todo={todo} key={todo.id} focusInput={focusInput} />
      ))}
      {tempTodo && (
        <TodoItem todo={tempTodo} key={tempTodo.id} focusInput={focusInput} />
      )}
    </>
  );
};
