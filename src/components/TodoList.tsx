import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { FilterBy } from './TodoFilter';

type Props = {
  todos: Todo[];
  filterType: FilterBy;
  isAdding: boolean;
  todoName: string;
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos, filterType, isAdding, todoName, onDelete,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filteredTodos = todos.filter(({ completed }) => {
    switch (filterType) {
      case FilterBy.Active:
        return completed === false;

      case FilterBy.Completed:
        return completed === true;

      case FilterBy.All:
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(({ id, completed, title }) => {
        return (
          <div
            key={id}
            data-cy="Todo"
            className={classNames(
              { todo: !completed },
              { 'todo completed': completed === true },
            )}
          >
            <label className="todo__status-label">
              {completed && (
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  defaultChecked
                />
              )}

            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                onDelete(id);
                setDeletingId(id);
              }}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames(
                'modal overlay',
                { 'is-active': deletingId === id },
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {isAdding && (
        <div
          key={0}
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todoName}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
