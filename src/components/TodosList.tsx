import React from 'react';
import { Todo } from './Todo';
import { Todo as TodoType } from '../types/Todo';

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
  todos: TodoType[];
  loadingTodoIds?: Set<number>;
  bulkOperationInProgress?: boolean;
  onUpdate?: (id: number, updates: Partial<TodoType>) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
};

export const TodosList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  bulkOperationInProgress,
  onUpdate,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          loadingTodoIds={loadingTodoIds}
          bulkOperationInProgress={bulkOperationInProgress}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
