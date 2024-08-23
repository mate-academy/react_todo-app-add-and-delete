/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './Todo';

type Props = {
  todos: Todo[];
  handleDelete: (id: number) => void;
  isLoadingTodos: number[];
  isLoading: boolean;
  tempTodo: Todo | null;
};

export const ListComponent: React.FC<Props> = ({
  todos,
  handleDelete,
  isLoadingTodos,
  isLoading,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDelete={handleDelete}
          isProcessing={isLoadingTodos.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDelete={handleDelete}
          isProcessing={isLoading}
        />
      )}
    </section>
  );
};
