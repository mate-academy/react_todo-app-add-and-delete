/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
  activeTodo: Todo | null;
  setActiveTodo: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
  loadingState: boolean;
};

export const ToDo: React.FC<Props> = ({
  todo,
  activeTodo,
  setActiveTodo,
  onDelete = () => {},
  loadingState,
}) => {
  const [onEdit] = useState(false);

  const completedTodo = todo.completed;

  const handleDelete = (todoToDelete: Todo) => {
    setActiveTodo(todoToDelete);
    onDelete(todoToDelete.id);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completedTodo })}
    >
      <label htmlFor={`${todo.id}`} className="todo__status-label">
        <input
          id={`${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completedTodo}
        />
      </label>

      {!onEdit ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(todo)}
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <Loader loadingState={loadingState} todo={todo} activeTodo={activeTodo} />
    </div>
  );
};
