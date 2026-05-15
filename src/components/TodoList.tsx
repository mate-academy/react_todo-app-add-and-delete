import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deletingTodoId: number | null;
  onDelete?: (todoId: number) => void;
  onChecked?: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingTodoId,
  onDelete,
  onChecked,
}) => {
  return (
    <>
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            isLoading={deletingTodoId === todo.id}
            onDelete={onDelete}
            onChecked={onChecked}
          />
        );
      })}
    </>
  );
};
