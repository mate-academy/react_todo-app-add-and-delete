import React from 'react';

import { Todo } from '../../types/Todo';

import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  onDelete: (value: number) => void,
  onCheckedToggle: (value: number) => void,
  isTodoLoading: Todo | null,
  tempTodo: Todo | null,
  todos: Todo[],
};

export const TodoList: React.FC<Props> = ({
  onDelete,
  onCheckedToggle,
  isTodoLoading,
  tempTodo,
  todos,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          isTodoLoading={isTodoLoading}
          todo={todo}
          onDelete={onDelete}
          onCheckedToggle={onCheckedToggle}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          isTodoLoading={isTodoLoading}
          todo={tempTodo}
          onDelete={onDelete}
          onCheckedToggle={onCheckedToggle}
        />
      )}
    </>
  );
};
