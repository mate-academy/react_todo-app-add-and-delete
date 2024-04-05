import { Todo } from '../types/Todo';
import React from 'react';
import { TodoItem } from './TodoItems';
import { useTodosContext } from '../context/TodoContext';

export const Todos: React.FC = () => {
  const { tempTodo, preparedTodos } = useTodosContext();

  return (
    <>
      {preparedTodos.map((todo: Todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} key={tempTodo.id} />}
    </>
  );
};
