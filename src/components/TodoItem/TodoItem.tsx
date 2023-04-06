import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
};

type TodoCondition = 'neutral' | 'seving' | 'editing';

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [todoCondition] = useState<TodoCondition>('neutral');

  const { title, completed } = todo;

  return (
    <div className={classNames(
      'todo',
      { completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {todoCondition === 'editing'
        ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>
        )
        : (
          <>
            <span className="todo__title">{title}</span>

            {/* Remove button appears only on hover */}
            <button type="button" className="todo__remove">×</button>
          </>
        )}

      <div className={classNames(
        'modal',
        'overlay',
        { 'is-active': todoCondition === 'seving' },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
