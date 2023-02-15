import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { removeTodo } from '../api/todos';

type Props = {
  todo: Todo,
  deleteItem: (todoId: number) => void,
  isProcessing: boolean,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
};

export const ListItem: React.FC<Props> = ({
  todo, deleteItem, isProcessing, setIsProcessing,
}) => {
  const deleteHandler = () => {
    setIsProcessing(true);

    removeTodo(todo.id)
      .then(() => {
        setIsProcessing(false);
        deleteItem(todo.id);
      })
      .catch(() => {
        setIsProcessing(false);
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

      <div
        data-cy="TodoLoader"
        className={classNames({
          modal: true,
          overlay: true,
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
