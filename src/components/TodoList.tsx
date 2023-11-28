import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  onDelete: (value: number) => void,
  onCheckedToggle: (value: number) => void,
  todos: Todo[],
  isTodoLoading: Todo | null,
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  onDelete,
  onCheckedToggle,
  todos,
  isTodoLoading,
  tempTodo,
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
