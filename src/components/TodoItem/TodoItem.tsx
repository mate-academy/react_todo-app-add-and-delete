import React from 'react';
import classNames from 'classnames';
import { Loader } from '../Loader/Loader';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo:(todoId: number) => void;
  changeStatus:(todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  changeStatus,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => changeStatus(todo.id)}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>

      <Loader />
    </div>
  );
};
