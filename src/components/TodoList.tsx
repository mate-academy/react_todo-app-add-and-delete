/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  deletingIds: number[];
  handlerDelete: (id: number) => void;
};

export const TodoList = ({
  todos,
  isAdding,
  deletingIds,
  handlerDelete,
}: Props & { handlerDelete: (id: number) => void }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id === 0 ? 'temp-todo' : todo.id}
          className={classNames('todo', {
            completed: todo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handlerDelete(todo.id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active':
                (todo.id === 0 && isAdding) || deletingIds.includes(todo.id),
              'is-hidden': !(
                (todo.id === 0 && isAdding) ||
                deletingIds.includes(todo.id)
              ),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
