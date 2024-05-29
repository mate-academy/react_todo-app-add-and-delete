import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { addTodoToServer, updateTodo, USER_ID } from '../api/todos';
import { UserWarning } from '../UserWarning';
import { DispatchContext, TodoContext } from './TodoContext';
import classNames from 'classnames';

export const Header: React.FC = () => {
  const { dispatch, resetErrorMessage } = useContext(DispatchContext);
  const [title, setTitle] = useState('');
  const { todos } = useContext(TodoContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const state = useContext(TodoContext);
  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      dispatch({ type: 'clearError' });
      event.preventDefault();
      if (title.trim().length === 0) {
        dispatch({
          type: 'setError',
          payload: { errorMessage: 'Title should not be empty' },
        });

        resetErrorMessage();
      }

      if (title.trim()) {
        setIsDisabled(true);

        const temporaryId = +new Date();

        const tempTodo = {
          id: temporaryId,
          title,
          userId: USER_ID,
          completed: false,
          isLoading: true,
        };

        dispatch({ type: 'addTempTodo', payload: { tempTodo: tempTodo } });

        dispatch({
          type: 'setItemLoading',
          payload: { id: tempTodo.id, isLoading: true },
        });

        return addTodoToServer({
          title: title.trim(),
          userId: USER_ID,
          completed: false,
          isLoading: false,
        })
          .then(createdTodo => {
            dispatch({
              type: 'updateTodoId',
              payload: { temporaryId, serverId: createdTodo.id },
            });
            dispatch({
              type: 'updateTodo',
              payload: { updatedTodo: { ...createdTodo, isLoading: false } },
            });
          })

          .catch(error => {
            dispatch({
              type: 'setError',
              payload: { errorMessage: 'Unable to add a todo' },
            });

            resetErrorMessage();

            dispatch({ type: 'deleteTodo', payload: { id: temporaryId } });

            throw error;
          })

          .then(() => setTitle(''))

          .finally(() => setIsDisabled(false));
      }

      return null;
    },
    [title, dispatch, resetErrorMessage],
  );

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [state]);

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
      {!!todos.length && (
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
          onChange={e => setTitle(e.target.value)}
          ref={inputField}
        />
      </form>
    </header>
  );
};
