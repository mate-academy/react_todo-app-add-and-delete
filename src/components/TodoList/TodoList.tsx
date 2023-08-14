import React, { useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

type Props = {
  todos: Todo[];
  setTodos: (a: Todo[]) => void;
  setErrorMessage: (a: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isUpdated] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChecked = () => {
    setChecked(!checked);
  };

  const handleRemoveTodo = async (id: number) => {
    try {
      await client.delete(`/todos/${id}`);

      if (id) {
        // eslint-disable-next-line max-len
        setTodos((prevTodos: Todo[]) => prevTodos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      setErrorMessage('Unable to delete todos');
      throw new Error('Unable to delete todos');
    }
  };

  return (

    <>
      {todos.map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            className={classNames('todo', {
              completed,
              editing: isEditing,
            })}
            key={id}
          >
            <label
              className="todo__status-label"
              onDoubleClick={handleDoubleClick}
              htmlFor={`toggle-view-${id}`}
            >
              <input
                type="checkbox"
                className="todo__status"
                id={`toggle-view-${id}`}
                checked={checked}
                onClick={handleChecked}
              />
            </label>

            <span className="todo__title">{title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleRemoveTodo(id)}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being updated */}
            {isUpdated && (
              <>
                <div className="modal overlay is-active">
                  <div
                    className="modal-background has-background-white-ter"
                  />
                  <div className="loader" />
                </div>
                <div className="todo">
                  <label className="todo__status-label">
                    <input type="checkbox" className="todo__status" />
                  </label>

                  <span className="todo__title">
                    Todo is being saved now
                  </span>
                  <button type="button" className="todo__remove">×</button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
};
