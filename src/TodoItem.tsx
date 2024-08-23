/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useContext } from 'react';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoContext } from './context/context';

interface Props {
  todo: Todo;
}

export const TodoItem: FC<Props> = ({ todo }) => {
  const { id, completed, title } = todo;
  const context = useContext(TodoContext);

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => context?.onSelectInputChange(id, completed)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => context?.deleteTodoInTodoList(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': context?.todoLoadingStates[id] || false,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
