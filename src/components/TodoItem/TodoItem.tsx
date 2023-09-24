/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { ErrorMessage, TodosContext } from '../TodosContext';
import { updateTodo } from '../../api/todos';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const {
    handleRemoveTodo,
    setAlarm,
    setIsTodoChange,
    changingItems,
    setChangingItems,
  } = useContext(TodosContext);

  const [updatedTodo, setUpdatedTodo] = useState<Todo>(todo);
  const [isComleted, setIsCompleted] = useState(completed);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateTodo = (value: boolean) => {
    setUpdatedTodo({
      ...todo,
      completed: value,
    });

    setIsTodoChange(true);
    setChangingItems(current => [...current, id]);
    updateTodo(updatedTodo)
      .then(() => {
        setIsCompleted(value);
        setChangingItems([]);
      })
      .catch(() => setAlarm(ErrorMessage.isUnableUpdateTodo))
      .finally(() => {
        setIsTodoChange(false);
      });
  };

  useEffect(() => {
    setIsLoading(changingItems.includes(id));
  }, [changingItems]);

  const isEdite = false;

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: isComleted },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdateTodo(!isComleted)}
        />
      </label>

      {!isEdite && (
        <>
          <span data-cy="TodoTitle" className="todo__title">{title}</span>
          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleRemoveTodo(todo)}
          >
            ×
          </button>
        </>
      )}

      {isEdite && (
        <form>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
