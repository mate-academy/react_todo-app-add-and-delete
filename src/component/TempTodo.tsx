/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useContext } from 'react';
import { TodosContext } from '../TodosProvider/TodosProvider';

type Props = {
  tempTodo: Todo;
};

export const TempTodo: React.FC<Props> = ({ tempTodo }) => {
  const { isLoadingToTemporary, handleComplete, isCompleted, handleDelete } =
    useContext(TodosContext);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: tempTodo.completed,
      })}
      key={tempTodo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={() => handleComplete(tempTodo.id, !tempTodo.completed)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(tempTodo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoadingToTemporary,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
