/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useContext } from 'react';
import { TodosContext } from '../TodosProvider/TodosProvider';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    handleComplete,
    isCompleted,
    handleDelete,
    isSelected,
    setIsSelected,
  } = useContext(TodosContext);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted ? isCompleted : todo.completed}
          onChange={() => handleComplete(todo.id, !todo.completed)}
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
          handleDelete(todo.id);
          setIsSelected(todo);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isSelected?.id === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
