import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo,
  isTempLoading?: boolean,
  setTodos?: (todos: Todo[]) => void,
  showError?: (title: string) => void,
  todos?: Todo[],
  toBeCleared?: Todo[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTempLoading,
  setTodos = () => {},
  showError = () => {},
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
        showError('Unable to delete todo');
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

  const onStatusShange = () => {
    setIsLoading(true);
    updateTodo(id, { completed: !completed }).then(() => {
      if (todos) {
        setTodos(todos.map(item => {
          return item.id === id
            ? { ...item, completed: !item.completed }
            : item;
        }));
      }
    })
      .catch(() => {
        showError('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={`todo${completed ? ' completed' : ''}`}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={onStatusShange}
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

      {(isTempLoading || isLoading) && (
        <>
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
          </div>
          <Loader />
        </>
      )}
    </div>
  );
};
