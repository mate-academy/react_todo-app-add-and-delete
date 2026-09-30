import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  deletingTodoIds: number[];
  onDelete: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deletingTodoIds,
  onDelete,
}) => (
  <>
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={deletingTodoIds.includes(todo.id)}
        onDelete={onDelete}
      />
    ))}
  </>
);
