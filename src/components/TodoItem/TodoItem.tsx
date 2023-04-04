import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../../Loader';

type Props = {
  todo: Todo,
  removeTodo: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = React.memo(({ todo, removeTodo }) => {
  const [completed, setCompleted] = useState(todo.completed);

  const {
    title,
    id,
  } = todo;

  const toggleCompleted = () => {
    setCompleted(prev => !prev);
  };

  const loadingContext = useContext(Loader);

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={toggleCompleted}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(id)}
      >
        ×
      </button>

      <div
        className={classNames(
          'modal overlay',
          {
            'is-active': loadingContext.includes(id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
