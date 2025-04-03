/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useCallback, useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteTodo } from '../../api/todos';
import callError from '../../utils/callError';
import { MainContext } from '../../ContextProvider/ContextProvider';

type TodoProps = {
  todo: Todo;
};

const TodoItem: React.FC<TodoProps> = ({ todo }) => {
  const { todos, setTodos, setError, loadingIds } = useContext(MainContext);

  const { id, title, completed } = todo;

  const [isEdited, setIsEdited] = useState(false);
  const [editedValue, setEditedValue] = useState(title);
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isLoading, setIsLoading] = useState(loadingIds.some(x => x === id));

  const handleDeleteClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      setIsLoading(true);
      deleteTodo(id)
        .then(() => {
          setTodos(todos.filter(task => task.id !== id));
        })
        .catch(() => callError(setError, 'delete'));
    },
    [id, todos, setError, setTodos],
  );

  const handleCheckboxChange = () => {
    setIsCompleted(prev => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(e.target.value);
  };

  const handleDoubleClick = () => {
    setIsEdited(true);
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={`todo ${isCompleted ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={handleCheckboxChange}
        />
      </label>

      {isEdited ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedValue}
            onChange={handleInputChange}
            onBlur={() => setIsEdited(false)}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {editedValue}
        </span>
      )}

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteClick}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
