import cn from 'classnames';
import { FC } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  deleteTodoByID: (arg: number) => void;
}

export const TodoItem:FC<Props> = ({ todo, isLoading, deleteTodoByID }) => {
  const { title, completed, id } = todo;

  const onHandleRemoveTodo = () => {
    deleteTodoByID(id);
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={onHandleRemoveTodo}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
