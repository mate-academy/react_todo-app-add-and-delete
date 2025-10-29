import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';

type Props = {
  todos: TodoType[];
  loadingIds?: Set<number>;
  onDelete?: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, loadingIds, onDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          isLoading={loadingIds?.has(todo.id) ?? false}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
