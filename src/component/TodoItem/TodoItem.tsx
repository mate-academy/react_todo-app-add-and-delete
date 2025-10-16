/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  todoDelete: boolean;
  clearTodoComplete: boolean;
  deleteTodos: (todoId: number) => Promise<unknown>;
  cheketCompleted: (todoId: number) => Promise<Todo> | undefined;
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, id, completed },
  todoDelete,
  clearTodoComplete,
  deleteTodos,
  cheketCompleted,
}) => {
  const [inputValue, setInputValue] = useState(title);
  const [selected, setSelected] = useState<number>(0);
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);

  const handlInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setInputValue(newValue);
  };

  const handleSelected = (idSelected: number) => {
    setSelected(idSelected);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          value={inputValue}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => cheketCompleted(id)}
        />
      </label>

      {selected === id ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={inputValue}
            onChange={handlInputValue}
            onBlur={() => setSelected(0)}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleSelected(id)}
        >
          {title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          deleteTodos(id);
          setDeleteId(id);
        }}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            (id === deleteId && todoDelete) ||
            (completed === true && clearTodoComplete),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
