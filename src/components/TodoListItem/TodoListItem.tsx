import React, { useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../contexts/TodosContext';

interface Props {
  todo: Todo;
}

export const TodoListItem: React.FC<Props> = ({ todo }) => {
  const { title, completed, id } = todo;
  const { handleDeleteTodo, todosIdsUpdating } = useContext(TodosContext);

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title" data-cy="TodoTitle">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteTodo(id)}
        data-cy="TodoDelete"
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': todosIdsUpdating.includes(id) },
        )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
