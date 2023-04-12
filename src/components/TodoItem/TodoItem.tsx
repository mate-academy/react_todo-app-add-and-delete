import classNames from 'classnames/bind';
import {FC, useContext} from 'react';
import { Todo } from '../../types/Todo';
import {AppTodoContext} from "../AppTodoContext/AppTodoContext";

interface Props {
  todo: Todo,
  onDelete?: (todoId: number) => void,
  isItTempTodo?: boolean,
}

export const TodoItem: FC<Props> = (
  { todo, onDelete, isItTempTodo },
) => {
  const { deletingTodoIDs } = useContext(AppTodoContext);
  const { title, completed, id } = todo;

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
        />
      </label>

      <span className="todo__title">{title}</span>

      {onDelete && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => {
            onDelete(id);
          }}
        >
          ×
        </button>
      )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': deletingTodoIDs.includes(id) },
        { 'is-active': isItTempTodo },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
