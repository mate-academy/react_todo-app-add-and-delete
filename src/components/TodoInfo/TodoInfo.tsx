import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  setActiveTodo: (todo: Todo) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoading,
  setActiveTodo,
}) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  <div
    className={classNames('todo', {
      completed: todo.completed,
    })}
    onClick={() => setActiveTodo(todo)}
  >
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
        checked
      />
    </label>

    <span className="todo__title">{todo.title}</span>

    <button type="button" className="todo__remove">×</button>

    <div className={classNames('modal overlay', {
      'is-active': isLoading,
    })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
