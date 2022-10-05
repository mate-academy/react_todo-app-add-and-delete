import { FC, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  removeTodo: (todoId: number) => void;
  // setIsAdding(loader: boolean): void;
  isAdding: boolean;
  handleStatusChange: (todoId: number, data: Partial<Todo>) => void;
  // upgradeTodos: (todoId: number, data: Partial<Todo>) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  removeTodo,
  // setIsAdding,
  isAdding,
  handleStatusChange,
  // upgradeTodos,
}) => {
  const [deletedId, setDeletedId] = useState<number | null>(null);

  const deleteTodo = (todoId: number) => {
    setDeletedId(todoId);
    removeTodo(todoId);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map((todo) => {
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
    </section>
  );
};
