import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isActiveLoaderTodos: number[];
  onDeleteTodo: (id: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isActiveLoaderTodos,
  onDeleteTodo,
}) => {
  function isActiveLoaderTodo(id: number): boolean {
    return isActiveLoaderTodos.includes(id);
  }

  const todosToRender: Todo[] = tempTodo
    ? [...todos, tempTodo]
    : todos;

  return (
    <>
      {todosToRender.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          hasLoader={isActiveLoaderTodo(todo.id)}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </>
  );
};
