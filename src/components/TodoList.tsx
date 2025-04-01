import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { FilterStatus } from '../types/FilterStatus';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  isLoading: boolean;
  onDelete: (id: number) => void;
  deletingTodoIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  filterStatus,
  isLoading,
  onDelete,
  deletingTodoIds,
  tempTodo,
}) => {
  const filteredTodos = todos.filter(todo => {
    if (filterStatus === FilterStatus.All) {
      return true;
    }

    if (filterStatus === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filterStatus === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {!todos.length ? (
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', { 'is-active': isLoading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      ) : (
        <>
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              isDeleting={deletingTodoIds.includes(todo.id)}
            />
          ))}

          {tempTodo && (
            <TodoItem todo={tempTodo} onDelete={() => {}} isLoading={true} />
          )}
        </>
      )}
    </section>
  );
};
