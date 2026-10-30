import React from 'react';
// import classNames from 'classnames';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
  onDelete: (id: number) => void;
};
export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  loadingIds,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {visibleTodos.map(todoItem => (
        <TodoItem
          todo={todoItem}
          key={todoItem.id}
          isLoading={loadingIds.includes(todoItem.id)}
          onDelete={onDelete}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};
