import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  handleRemove: (todoId: number) => Promise<unknown>,
  handleChangeCheckBox: (todoId: number) => void,
}

export const TodoItem: FC<Props> = ({
  todo,
  handleRemove,
  handleChangeCheckBox,
}) => {
  return (
    <div
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleChangeCheckBox(todo.id)}
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleRemove(todo.id)}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
