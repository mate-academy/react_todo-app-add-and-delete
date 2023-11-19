import cn from 'classnames';
import { useContext } from 'react';
import { Todo } from '../types/Todo';
import { TodoContext } from './TodoContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { title, completed, id } = todo;
  const { deleteTodo, isLoading } = useContext(TodoContext);

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', { completed })}
        key={todo.id}
      >
        <label
          className="todo__status-label"
        >
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            readOnly
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn(
            'modal overlay',
            { 'is-active': isLoading && !todo.id },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

    </>
  );
};
