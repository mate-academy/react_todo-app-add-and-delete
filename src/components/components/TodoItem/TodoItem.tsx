import React, { useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../../../types/Todo';
import { DefaultContext } from '../DefaultContext';

type Props = {
  todo: Todo,
  isAdding: boolean,
};

export const TodoItem = React.memo(
  ({
    todo, isAdding,
  }: Props) => {
    const { removeTodo, removedTodosIds } = useContext(DefaultContext);

    return (
      <div
        data-cy="Todo"
        className={todo.completed ? 'todo completed' : 'todo'}
        key={todo.id}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => removeTodo(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={
            classNames(
              'modal',
              'overlay',
              {
                'is-active': isAdding || removedTodosIds.includes(todo.id),
              },
            )
          }
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
