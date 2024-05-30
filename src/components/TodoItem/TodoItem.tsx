/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { useTodos } from '../../providers';

interface Props {
  todo: Todo;
}

export const TodoItem: FC<Props> = ({ todo }) => {
  const { todosInUpdate } = useTodos();
  const { onDeleteTodo } = useTodos();

  const handleDelte = () => onDeleteTodo(todo.id);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelte}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': todosInUpdate.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
