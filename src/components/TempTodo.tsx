import { useContext } from 'react';
import classNames from 'classnames';
import { TodosContext } from './TodoContext';

export const TempTodo = () => {
  const { todoLoader, tempTodo } = useContext(TodosContext);

  return (
    <div
      data-cy="Todo"
      className="todo"
      key={tempTodo?.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={tempTodo?.completed}
        />
      </label>
      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {tempTodo?.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': todoLoader === 0 },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
