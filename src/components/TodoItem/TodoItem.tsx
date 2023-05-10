import React, { useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { LoadDeleteContext } from '../../LoadDeleteContext';

type Props = {
  todo: Todo;
  updateTodo: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  clearTodo: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  updateTodo,
  clearTodo,
}) => {
  const {
    loadDelete,
  } = useContext(LoadDeleteContext);

  return (
    <>
      <div className={classNames('todo', { completed: todo.completed })}>
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            onChange={(event) => updateTodo(event, todo.id)}
            checked={todo.completed}
          />
        </label>

        <span className="todo__title">{todo.title}</span>

        {/* Remove button appears only on hover */}
        <button
          type="button"
          className="todo__remove"
          onClick={() => clearTodo(todo)}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being updated */}
        <div className={classNames(
          'modal overlay', {
            'is-active': loadDelete.includes(
              todo.id,
            ),
          },
        )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
