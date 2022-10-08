import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { BlancTodo } from './BlancTodo';
import { FilterBy } from './TodoFilter';

type Props = {
  todos: Todo[];
  filterType: FilterBy;
  isAdding: boolean;
  todoName: string;
  onDelete: (id: number) => void;
  setErrorClosing: (err: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  filterType,
  isAdding,
  todoName,
  onDelete,
  setErrorClosing,
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

  const handleTodoDelete = (todoId: number) => {
    onDelete(todoId);
    setDeletingId(todoId);
    setErrorClosing(false);

    setTimeout(() => setDeletingId(null), 1000);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(({ id, completed, title }) => {
        return (
          <div
            key={id}
            data-cy="Todo"
            className={classNames(
              {
                todo: !completed,
                'todo completed': completed === true,
              },
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
              onClick={() => handleTodoDelete(id)}
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
        <BlancTodo todoName={todoName} />
      )}
    </section>
  );
};
