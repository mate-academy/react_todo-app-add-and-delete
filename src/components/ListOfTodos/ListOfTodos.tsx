/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Actions } from '../../types/Actions';
import { filteredTodos } from '../../utils/filteredTodos';

type Props = {
  todos: Todo[];
  actions: Actions;
  loading: { [key: number]: boolean };
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
};
export const ListOfTodos: React.FC<Props> = ({
  todos,
  actions,
  loading,
  onDelete,
  tempTodo,
}) => {
  return (
    <>
      {todos.length > 0 && (
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos(todos, actions).map(({ id, title, completed }) => (
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: completed,
              })}
              key={id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDelete(id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': loading[id],
                })}
              >
                <div
                  className="modal-background
                    has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo && (
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: tempTodo.completed,
              })}
              key={tempTodo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={tempTodo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDelete(tempTodo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': loading[tempTodo.id],
                })}
              >
                <div
                  className="modal-background
                    has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};
