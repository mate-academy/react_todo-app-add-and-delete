import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoDeleteButton } from './TodoDeleteButton';

interface Props {
  todo: Todo;
  isLoading: boolean;
  onDelete: () => void;
  onToggle: () => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
}) => {
  return (
    <div
      className={classNames('todo', { completed: todo.completed })}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          checked={todo.completed}
          className="todo__status"
          data-cy="TodoStatus"
          type="checkbox"
          onChange={onToggle}
          aria-label={`Mark ${todo.title} as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
      </label>

      <span className="todo__title" data-cy="TodoTitle">
        {todo.title}
      </span>

      <TodoDeleteButton onDelete={onDelete} isLoading={isLoading} />

      <div
        className={classNames('modal', { 'is-active': isLoading })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
