import React, { useContext } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { DeleteModalContext } from '../../context/DeleteModalContext';

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
    deleteModal,
  } = useContext(DeleteModalContext);

  return (
    <>
      <div className={cn('todo', { completed: todo.completed })}>
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            onChange={(event) => updateTodo(event, todo.id)}
            checked={todo.completed}
          />
        </label>

        <span className="todo__title">{todo.title}</span>

        <button
          type="button"
          className="todo__remove"
          onClick={() => clearTodo(todo)}
        >
          ×
        </button>

        <div className={cn(
          'modal overlay', {
            'is-active': deleteModal.includes(
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
