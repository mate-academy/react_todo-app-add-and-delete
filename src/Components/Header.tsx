import React, { useCallback, useContext, useState } from 'react';
import { addTodoToServer, updateTodo, USER_ID } from '../api/todos';
import { UserWarning } from '../UserWarning';
import { DispatchContext, TodoContext } from './TodoContext';
import classNames from 'classnames';

export const Header: React.FC = () => {
  const { dispatch, resetErrorMessage } = useContext(DispatchContext);
  const [title, setTitle] = useState('');
  const { todos } = useContext(TodoContext);
  // const state = useContext(TodoContext);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      if (title.trim().length === 0) {
        dispatch({
          type: 'setError',
          payload: { errorMessage: 'Title should not be empty' },
        });

        resetErrorMessage();
      }

      if (title.trim()) {
        dispatch({ type: 'setAdding', payload: { isAdded: true } });
        setIsDisabled(true);

        const temporaryId = +new Date();

        const newTodo = {
          id: temporaryId,
          title,
          userId: USER_ID,
          completed: false,
        };

        dispatch({ type: 'addTodo', payload: { newTodo } });

        dispatch({
          type: 'setItemLoading',
          payload: { id: newTodo.id, isLoading: true },
        });

        return addTodoToServer({ title, userId: USER_ID, completed: false })
          .then(createdTodo => {
            dispatch({
              type: 'updateTodoId',
              payload: { temporaryId, serverId: createdTodo.id },
            });

            dispatch({
              type: 'setItemLoading',
              payload: { id: createdTodo.id, isLoading: false },
            });
          })
          .catch(error => {
            dispatch({ type: 'deleteTodo', payload: { id: temporaryId } });

            dispatch({
              type: 'setError',
              payload: { errorMessage: 'Unable to add a todo' },
            });

            resetErrorMessage();

            throw error;
          })
          .then(() => {
            setTitle('');
          })
          .finally(() => {
            setIsDisabled(false);
            dispatch({ type: 'setAdding', payload: { isAdded: false } });
          });
      }

      return null;
    },
    [title, dispatch, resetErrorMessage],
  );

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    dispatch({ type: 'setLoading', payload: { isLoading: true } });

    const toggleAllPromises = updatedTodos.map(todo => {
      return updateTodo(todo);
    });

    Promise.all(toggleAllPromises)
      .then(results => {
        dispatch({ type: 'toggleAll', payload: { updatedTodos: results } });
      })
      .finally(() => {
        dispatch({ type: 'setLoading', payload: { isLoading: false } });
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={isDisabled}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => {
            setTitle(e.target.value);
          }}
          autoFocus
          // ref={inputField}
        />
      </form>
    </header>
  );
};
