import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';
import { deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo,
  isTempLoading?: boolean,
  setTodos?: (todos: Todo[]) => void,
  pushError?: (title: string) => void,
  todos?: Todo[],
  toBeCleared?: Todo[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTempLoading,
  setTodos = () => {},
  pushError = () => {},
  todos,
  toBeCleared,
}) => {
  const { completed, title, id } = todo;
  const [isBeingEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = () => {
    setIsLoading(true);

    deleteTodo(id)
      .then(() => {
        if (todos) {
          setTodos(todos.filter(item => item.id !== id));
        }
      })
      .catch(() => {
        pushError('Unable to delete todo');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    toBeCleared?.forEach(item => {
      if (item.id === id) {
        onDelete();
      }
    });
  }, [toBeCleared]);

  return (
    <div className={`todo${completed ? ' completed' : ''}`}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {isBeingEdited
        ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>
        )
        : (
          <>
            <span className="todo__title">{title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={onDelete}
            >
              ×
            </button>
          </>
        )}

      <div className={`modal overlay${isTempLoading || isLoading ? ' is-active' : ''}`}>
        <div className="modal-background has-background-white-ter" />
        <Loader />
      </div>
    </div>
  );
};
