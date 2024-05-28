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
  const { todos, isLoading, isLoadingItems } = useContext(TodoContext);

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
      isLoading: todo.isLoading,
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
        isLoading: todo.isLoading,
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

  const handleClick = (todoDelete: Todo) => {
    const currentTodos = [...todos];

    dispatch({
      type: 'setItemLoading',
      payload: { id: todoDelete.id, isLoading: true },
    });

    deleteTodoFromServer(todo.id)
      .catch(error => {
        dispatch({
          type: 'setError',
          payload: { errorMessage: 'Unable to delete a todo' },
        });

        dispatch({
          type: 'setTodos',
          payload: currentTodos,
        });

        throw error;
      })
      .then(() => {
        dispatch({ type: 'deleteTodo', payload: { id: todoDelete.id } });
      })
      .finally(() => {
        dispatch({
          type: 'setItemLoading',
          payload: { id: todoDelete.id, isLoading: false },
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
                onClick={() => handleClick(todo)}
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
