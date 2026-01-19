import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  handleTodoDelete: (id: number) => void;
  processings: Set<number>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleTodoDelete,
  processings,
}) => {
  const [isChecked, setIsChecked] = useState(todo.completed);

  const onChangeChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const isProcessed = processings.has(todo.id);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo item-enter-done', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" aria-label="label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={onChangeChecked}
          checked={isChecked}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          handleTodoDelete(todo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
