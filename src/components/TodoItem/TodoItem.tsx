import React, { useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { showErrorMesage } from '../../utils/showErrorMesage';

type Props = {
  todo: Todo;
  errorFunction: (el: string) => void;
  deletingFunction: (el: boolean) => void;
  deletingListId: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  errorFunction,
  deletingFunction,
  deletingListId,
}) => {
  const { id, completed, title } = todo;

  const [loader, setLoader] = useState(false);
  // const [isChecked, setChecked] = useState(false);

  const isDeleting = deletingListId.includes(id);

  const handleDeleteBtn = () => {
    setLoader(true);
    deletingFunction(true);

    deleteTodo(todo.id)
      .catch(er => {
        showErrorMesage('Unable to delete a todo', errorFunction);
        throw er;
      })
      .finally(() => {
        setLoader(false);
        deletingFunction(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={id}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${id}`}>
        <input
          data-cy="TodoStatus"
          id={`todo-status-${id}`}
          type="checkbox"
          className="todo__status"
          checked={completed}
          // onChange={e => setChecked(e.target.checked)}
        />
        {/* Add accessible text */}
        <span className="sr-only">
          Mark as {completed ? 'incomplete' : 'complete'}
        </span>
      </label>
      {false ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
          />
        </form>
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
      )}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          handleDeleteBtn();
        }}
      >
        ×
      </button>
      {/* <div data-cy="TodoLoader" className="modal overlay "> */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loader || isDeleting,
        })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        {/* eslint-enable max-len */}
        <div className="loader" />
      </div>
    </div>
  );
};
