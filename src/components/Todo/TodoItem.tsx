/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { Todo as TodoType } from '../../types/Todo';

type Props = {
  onDelete: (todoId: number) => void;
  todo: TodoType;
  todoIdToDelete: number;
  isClearLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  todoIdToDelete,
  isClearLoading,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {' '}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            todoIdToDelete === todo.id || (isClearLoading && todo.completed),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
