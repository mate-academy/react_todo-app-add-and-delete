/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  deleteTodo, getTodos, patchTodo, postTodo,
} from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Filter } from './types/enum';
import { TodoContext } from './TodoContext';
import { State, Todo } from './types/interfaces';

const USER_ID = 82;

export const App: React.FC = () => {
  const [state, setState] = useState<State>({
    todos: [],
    filter: Filter.All,
  });

  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<number[]>([]);

  const removeLoading = (todoId: number) => {
    setIsLoading((prev) => {
      prev.splice(prev.indexOf(todoId), 1);

      return prev;
    });
  };

  useEffect(() => {
    if (tempTodo) {
      postTodo(tempTodo).then(todo => {
        setState(prev => ({
          ...prev,
          todos: [...prev.todos, todo],
        }));
      })
        .then(() => {
          setTempTodo(null);
        })
        .catch(() => {
          setError('Unable to add a todo');
          setTempTodo(null);
        });
    }
  }, [tempTodo]);

  useEffect(() => {
    const hideErrorTimeout = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(hideErrorTimeout);
    };
  }, [error]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todos) => {
        setState((prev) => ({
          ...prev,
          todos,
        }));
      })
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function handleCheck(todo: Todo) {
    const checkTodo = { ...todo };

    checkTodo.completed = !todo.completed;

    function replaceTodo(prevState: State, patchedTodo: Todo) {
      prevState.todos.splice(prevState.todos.indexOf(todo), 1, patchedTodo);

      return prevState.todos;
    }

    patchTodo(checkTodo)
      .then(patchedTodo => {
        setState(prev => ({
          ...prev,
          todos: replaceTodo(prev, patchedTodo),
        }));
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => {
        removeLoading(checkTodo.id);
      });
  }

  function handleDeleteTodo(todo: Todo) {
    deleteTodo(todo.id)
      .then(() => {
        setState((prev) => ({
          ...prev,
          todos: prev.todos.filter((t) => t.id !== todo.id),
        }));
      })
      .catch(() => {
        setError('Unable to delete the todo');
      })
      .finally(() => {
        removeLoading(todo.id);
      });
  }

  function deleteAllCompleted() {
    const completedTodo = state.todos.filter(todo => todo.completed);

    setIsLoading(prev => (
      [...prev, ...completedTodo.map(todoId => todoId.id)]
    ));

    for (const todo of completedTodo) {
      handleDeleteTodo(todo);
    }
  }

  const contextValue = {
    state,
    setState,
    handleCheck,
    tempTodo,
    handleDeleteTodo,
    deleteAllCompleted,
    setIsLoading,
    isLoading,
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          tempTodo={tempTodo}
          setTempTodo={setTempTodo}
          setError={setError}
          error={error}
        />

        <TodoContext.Provider value={contextValue}>
          {state.todos.length > 0
          && (
            <>
              <TodoList />
              <TodoFooter />
            </>
          )}

        </TodoContext.Provider>
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
