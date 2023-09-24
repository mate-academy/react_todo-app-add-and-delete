/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  onCompletedChange?: (todoId: number) => void,
  onDeleteTodo: (todoId: number) => void,
  loadingTodosIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onCompletedChange,
  onDeleteTodo,
  loadingTodosIds,
}) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {todos.map(todo => (
        <TodoItem
          onDeleteTodo={onDeleteTodo}
          key={todo.id}
          todo={todo}
          onCompletedChange={onCompletedChange}
          isLoading={loadingTodosIds.includes(todo.id)}
        />
      ))}
    </section>
  );
};
