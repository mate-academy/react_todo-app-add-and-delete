/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  visibleTodos: Todo[];
  handleDelete: (id: number) => void;
  loadingTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  handleDelete,
  loadingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDelete={handleDelete}
          isLoading={todo.id === loadingTodoId}
        />
      ))}
    </section>
  );
};
