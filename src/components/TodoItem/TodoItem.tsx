/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState } from 'react';
import './TodoItem.scss';

import { Todo } from './../../types/Todo';
import classNames from 'classnames';
import { Loader } from './../Loader';
import { EditTodo } from './../EditTodo';

type Props = {
  todo: Todo;
  onDelete?: (id: number) => Promise<void>;

  isAffectedTodo?: boolean;

  onUpdateTodo?: (
    id: number,
    title: string,
    completed: boolean,
  ) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => Promise.resolve(),
  isAffectedTodo = false,
  onUpdateTodo = () => Promise.resolve(),
}) => {
  const { id, title, completed } = todo;

  const [isHandleTodo, setIsHandleTodo] = useState(false);
  const [isRenameTodo, setIsRenameTodo] = useState(false);

  const cancelRename = () => {
    setIsRenameTodo(false);
  };

  function handleTodoStatus(changeEvent: React.ChangeEvent<HTMLInputElement>) {
    setIsHandleTodo(true);
    const newTodoStatus = changeEvent.target.checked;

    onUpdateTodo(id, title, newTodoStatus).finally(() => {
      setIsHandleTodo(false);
    });
  }

  function handleDeleteTodo(currentID: number) {
    setIsHandleTodo(true);

    return onDelete(currentID).finally(() => {
      setIsHandleTodo(false);
    });
  }

  function handleRenameTodo(currentID: number, currentTitle: string) {
    setIsHandleTodo(true);
    setIsRenameTodo(true);

    return onUpdateTodo(currentID, currentTitle, completed).finally(() => {
      setIsHandleTodo(false);
      setIsRenameTodo(false);
    });
  }

  const isLoaderOn = isHandleTodo || todo.id === 0 || isAffectedTodo;

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoStatus}
        />
      </label>

      {!isRenameTodo ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsRenameTodo(true);
            }}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>
        </>
      ) : (
        <EditTodo
          todo={todo}
          onCancelRename={cancelRename}
          onRenameDelete={handleDeleteTodo}
          onEditTodo={handleRenameTodo}
        />
      )}

      <Loader isLoaderOn={isLoaderOn} />
    </div>
  );
};
