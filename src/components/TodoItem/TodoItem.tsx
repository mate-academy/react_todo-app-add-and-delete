import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  removeTodo: (id: number) => void,
  isLoading: boolean,
};

export const TodoItem: React.FC<Props> = ({ todo, removeTodo, isLoading }) => {
  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed === true,
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

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
