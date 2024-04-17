import React, { useContext, useEffect, useMemo, useRef } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodos, getTodos, postTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';
import { DispatchContext, StateContext } from './utils/GlobalStateProvider';

// function debounce(callback: Function, delay: number) {
//   let timerId = 0;

//   window.clearTimeout(timerId);
//   return (...args: any) => {
//     timerId = window.setTimeout(() => {
//       callback(...args);
//     }, delay);
//   };
// }

export const App: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { title, filter, todos, isDisabled, tempTodo, error } =
    useContext(StateContext);

  //#region useRef
  const cancelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerErrorId = useRef<number | null>(null);
  //#endregion

  //#region handlers
  const handleError = (errorMessage: Errors, delay = 3000) => {
    dispatch({ type: 'setError', payload: errorMessage });

    if (timerErrorId.current) {
      window.clearTimeout(timerErrorId.current);
    }

    timerErrorId.current = window.setTimeout(() => {
      dispatch({ type: 'setError', payload: Errors.reset });
    }, delay);
  };

  // const applyQuery = useCallback(
  //   debounce(setTitle, 300),
  //   [],
  // );

  const filteredTodos = () => {
    switch (filter) {
      case Filter.active:
        return todos.filter(todo => !todo.completed);

      case Filter.completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const reset = () => {
    dispatch({ type: 'setTempTodo', payload: null });

    dispatch({ type: 'setIsDisabled', payload: false });
  };

  const memorizedTodos = useMemo(filteredTodos, [filter, todos]);
  const todosCounter = todos.reduce(
    (prev, current) => prev + +!current.completed,
    0,
  );

  const handleCancel = () => {
    if (cancelRef.current) {
      cancelRef.current.classList.add('hidden');
    }
  };

  const handleDeleteAll = () => {
    const deletingIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    const failedTodos: number[] = [];

    dispatch({ type: 'setDeletingList', payload: deletingIds });

    Promise.allSettled(deletingIds.map(id => deleteTodos(id)))
      .then(results => {
        results.forEach((result, i) => {
          if (result.status === 'rejected') {
            failedTodos.push(deletingIds[i]);
            handleError(Errors.deletingError);
          }

          dispatch({
            type: 'setTodos',
            payload: todos.filter(
              todo =>
                !deletingIds.includes(todo.id) || failedTodos.includes(todo.id),
            ),
          });
        });
      })

      .catch(promiseError => {
        throw promiseError;
      })

      .finally(() => {
        dispatch({ type: 'setDeletingList', payload: [] });
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'setError', payload: Errors.reset });
    dispatch({ type: 'setIsDisabled', payload: true });

    if (!title.trim()) {
      handleError(Errors.emptyTitle);
      reset();

      return;
    }

    dispatch({
      type: 'setTempTodo',
      payload: {
        title,
        completed: false,
        userId: USER_ID,
        id: 0,
      },
    });

    return postTodo({ title })
      .then(newTodo => {
        const { id } = newTodo;

        dispatch({
          type: 'setTodos',
          payload: [
            ...todos,
            {
              id,
              title: title.trim(),
              userId: USER_ID,
              completed: false,
            },
          ],
        });

        dispatch({ type: 'setTitle', payload: '' });
        inputRef.current?.focus();
      })
      .catch(promiseError => {
        handleError(Errors.addingError);
        throw promiseError;
      })
      .finally(() => {
        reset();
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setTitle', payload: e.target.value });
    // setTitle(e.target.value);
    // applyQuery(e.target.value);
  };

  //#endregion

  //#region useEffect
  useEffect(() => {
    getTodos()
      .then(recievedTodos =>
        dispatch({ type: 'setTodos', payload: recievedTodos }),
      )
      .catch(() => {
        handleError(Errors.loadingError);
      });

    inputRef.current?.focus();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, tempTodo]);

  //#endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: todos.filter(todo => todo.completed).length > 0,
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              disabled={isDisabled}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleInputChange}
            />
          </form>
        </header>

        <TodoList
          todos={memorizedTodos}
          independentTodo={tempTodo}
          handleError={handleError}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todosCounter} items left`}
            </span>

            <TodoFilter />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleDeleteAll}
              disabled={todos.filter(todo => todo.completed).length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: error.length === 0,
          },
        )}
        ref={cancelRef}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleCancel}
        />
        {error}
      </div>
    </div>
  );
};
