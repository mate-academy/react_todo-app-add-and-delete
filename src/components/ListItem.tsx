import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { removeTodo } from '../api/todos';
import { Loader } from './Loader';

type Props = {
  todo: Todo,
  deleteItem: (todoId: number) => void,
  setMessageError: React.Dispatch<React.SetStateAction<string>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
};

export const ListItem: React.FC<Props> = ({
  todo, deleteItem, setMessageError, setError,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteHandler = () => {
    setIsDeleting(true);

    removeTodo(todo.id)
      .then(() => {
        setIsDeleting(false);
        deleteItem(todo.id);
      })
      .catch(() => {
        setIsDeleting(false);
        setError(true);
        setMessageError('Unable to delete todo');
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames({
        todo: true,
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={deleteHandler}
      >
        ×
      </button>

      <Loader
        id={todo.id}
        isDeleting={isDeleting}
      />

    </div>
  );
};
