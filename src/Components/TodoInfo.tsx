import React, { useCallback, useContext, useState } from 'react';
import { Todo } from '../types/Todo';
import { DispatchContext, TodoContext } from './TodoContext';
import classNames from 'classnames';
import { deleteTodoFromServer, updateTodo, USER_ID } from '../api/todos';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
};

export const TodoInfo: React.FC<Props> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const { dispatch } = useContext(DispatchContext);
  // const [loading, setLoading] = useState(false);
  const { todos, isLoading, isAdded, isLoadingItems } = useContext(TodoContext);

  // useEffect(() => {}, [isLoadingItem]);

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked;

    dispatch({
      type: 'setItemLoading',
      payload: { id: todo.id, isLoading: true },
    });

    updateTodo({
      id: todo.id,
      userId: USER_ID,
      title: todo.title,
      completed: newStatus,
    })
      .then(updatedTodo => {
        dispatch({
          type: 'updateTodo',
          payload: { updatedTodo },
        });
      })
      .finally(() => {
        dispatch({
          type: 'setItemLoading',
          payload: { id: todo.id, isLoading: false },
        });
      });
  };

  const saveChanges = useCallback(() => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle) {
      updateTodo({
        id: todo.id,
        userId: USER_ID,
        title: trimmedTitle,
        completed: todo.completed,
      })
        .then(() => {
          dispatch({
            type: 'updateTodo',
            payload: { updatedTodo: { ...todo, title: trimmedTitle } },
          });
        })
        .catch(() => {
          dispatch({
            type: 'setError',
            payload: { errorMessage: 'Unable to update a todo' },
          });
        });
    } else {
      dispatch({
        type: 'deleteTodo',
        payload: { id: todo.id },
      });
    }

    setIsEditing(false);
  }, [dispatch, editedTitle, todo]);

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        saveChanges();
      }

      if (e.key === 'Escape') {
        setIsEditing(false);
        setEditedTitle(todo.title);
      }
    },
    [saveChanges, todo.title],
  );

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleClick = () => {
    dispatch({ type: 'deleteTodo', payload: { id: todo.id } });
    deleteTodoFromServer(todo.id).catch(() => {
      dispatch({ type: 'setTodos', payload: todos });
      dispatch({
        type: 'setError',
        payload: { errorMessage: 'Unable to delete a todo' },
      });
    });
  };

  return (
    <>
      {todo && (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: todo.completed,
            'temp-item-enter-active': isAdded,
          })}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={handleCheckBoxChange}
            />
          </label>

          {isEditing ? (
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editedTitle}
                onChange={e => setEditedTitle(e.target.value)}
                onBlur={saveChanges}
                onKeyUp={handleKeyUp}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={handleDoubleClick}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={handleClick}
              >
                ×
              </button>
            </>
          )}

          <Loader loading={isLoadingItems[todo.id] || isLoading} />
        </div>
      )}
    </>
  );
};
