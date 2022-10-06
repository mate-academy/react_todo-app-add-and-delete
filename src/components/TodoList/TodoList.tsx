import { FC, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  visibleTodos: Todo[];
  removeTodo: (todoId: number) => void;
  isAdding: boolean;
  handleStatusChange: (todoId: number, data: Partial<Todo>) => void;
  mainInput: string;
}

export const TodoList: FC<Props> = ({
  visibleTodos,
  removeTodo,
  isAdding,
  handleStatusChange,
  mainInput,
}) => {
  const [deletedId, setDeletedId] = useState<number | null>(null);

  const deleteTodo = (todoId: number) => {
    setDeletedId(todoId);
    removeTodo(todoId);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">

      {visibleTodos.map((todo) => {
        const { id, title, completed } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames(
              'todo',
              { completed },
            )}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onClick={() => {
                  handleStatusChange(id, { completed: !completed });
                }}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => deleteTodo(id)}
            >
              ×
            </button>

            {isAdding && (
              <div
                data-cy="TodoLoader"
                className={classNames(
                  'modal',
                  'overlay',
                  { 'is-active': id === deletedId },
                )}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )}
          </div>
        );
      })}
      {isAdding && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">{mainInput}</span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
