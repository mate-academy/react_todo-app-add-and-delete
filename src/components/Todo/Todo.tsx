import { FC } from 'react';
import cn from 'classnames';
import { Todo as TodoTypes } from '../../types/Todo';

type Props = {
  todo: TodoTypes,
  deleteTodo: (id: number) => void,
  Loader: boolean;
};

export const Todo: FC<Props> = ({
  todo,
  deleteTodo,
  Loader,
}) => {
  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={cn('todo', { completed: todo.completed })}
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

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': Loader },
        )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>

    </div>
  );
};
