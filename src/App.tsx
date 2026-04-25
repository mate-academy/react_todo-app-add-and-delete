/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoAppMain } from './components/TodoAppMain';
import { TodoMainFooter } from './components/TodoMainFooter';
import classNames from 'classnames';
import { FilterOptions } from './components/TodoMainFooter/TodoMainFooter';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [notificationError, setNotificationError] = useState(false);

  const [errorTodos, setErrorTodos] = useState(false);
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorPostTodo, setErrorPostTodo] = useState(false);
  const [loadingPostTodo, setLoadingPostTodo] = useState(false);

  const [filterTodos, setFilterTodos] = useState<FilterOptions>('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [counter, setCounter] = useState(0);

  const [titleTodo, setTitleTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [loaderDelete, setLoaderDelete] = useState(false);
  const [selectedDeleteTodo, setSelectedDeleteTodo] = useState<number | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState(false);

  const [clearButton, setClearButton] = useState(false);
  const [loaderDeleteCompleted, setLoaderDeleteCompleted] = useState(false);

  const visibleTodos = todos.filter(todo => {
    if (filterTodos === 'active') {
      return todo.completed === false;
    }

    if (filterTodos === 'completed') {
      return todo.completed;
    }

    return todos;
  });

  function loadTodos() {
    getTodos()
      .then(serverTodos => {
        setTodos(serverTodos);
        setCounter(serverTodos.length);
      })
      .catch(() => {
        setErrorTodos(true);
        setNotificationError(true);
      })
      .finally(() => {
        setLoadingTodos(false);
        setTimeout(() => {
          setNotificationError(false);
          setErrorTodos(false);
        }, 3000);
      });
  }

  useEffect(() => {
    setLoadingTodos(true);
    loadTodos();
  }, []);

  function addTodo(newTodo: Todo) {
    setLoadingPostTodo(true);
    const { id, ...data } = newTodo;

    setTodos(currentTodos => [...currentTodos, newTodo]);
    postTodo(data)
      .then(serverTodo => {
        setTodos(currentTodo => [
          ...currentTodo.filter(todo => todo.id !== newTodo.id),
          serverTodo,
        ]);
        setCounter(currentCounter => currentCounter + 1);
      })
      .catch(() => {
        setTodos(currentTodo => [
          ...currentTodo.filter(todo => todo.id !== newTodo.id),
        ]);
        setNotificationError(true);
        setErrorPostTodo(true);
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingPostTodo(false);

        setTimeout(() => {
          setNotificationError(false);
          setErrorPostTodo(false);
        }, 3000);
      });
  }

  useEffect(() => {
    if (tempTodo) {
      addTodo(tempTodo);
    }
  }, [tempTodo]);

  useEffect(() => {
    if (notificationError) {
      setTimeout(() => {
        setNotificationError(false);
      }, 3000);
    }
  }, [notificationError]);

  function deleteButtonTodo(todoId: number) {
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setCounter(currentCounter => currentCounter - 1);
      })
      .catch(() => {
        setNotificationError(true);
        setDeleteError(true);
      })
      .finally(() => {
        setLoaderDelete(false);
        setSelectedDeleteTodo(null);
        setTimeout(() => {
          setNotificationError(false);
          setDeleteError(false);
        }, 3000);
      });
  }

  useEffect(() => {
    if (selectedDeleteTodo) {
      setLoaderDelete(true);
      deleteButtonTodo(selectedDeleteTodo);
    }
  }, [selectedDeleteTodo]);

  function deletAllCompletedTodos(todosArr: Todo[]) {
    const completedTodos = todosArr.filter(todo => todo.completed);

    completedTodos.map(todo => {
      const todoId = todo.id;

      deleteTodo(todoId)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todoArr => todoArr.id !== todoId),
          );
          setCounter(currentCounter => currentCounter - 1);
        })
        .catch(() => {
          setNotificationError(true);
          setDeleteError(true);
        })
        .finally(() => {
          setLoaderDeleteCompleted(false);
          setClearButton(false);
          setTimeout(() => {
            setNotificationError(false);
            setDeleteError(false);
          }, 3000);
        });
    });
  }

  useEffect(() => {
    if (clearButton) {
      setLoaderDeleteCompleted(true);
      deletAllCompletedTodos(todos);
    }
  }, [clearButton]);
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          loaderClearButton={loaderDeleteCompleted}
          loaderDeleteButton={loaderDelete}
          loadingPostTodo={loadingPostTodo}
          title={titleTodo}
          setTitle={setTitleTodo}
          setNotificationError={setNotificationError}
          setTempTodo={setTempTodo}
          setErrorTitle={setErrorTitle}
          errorPostTodo={errorPostTodo}
        />

        <TodoAppMain
          todos={visibleTodos}
          tempTodo={tempTodo}
          loaderDelete={loaderDelete}
          onSelectedTodo={setSelectedDeleteTodo}
          selectedDeleteTodo={selectedDeleteTodo}
          loaderClearButton={loaderDeleteCompleted}
        />

        {todos.length > 0 && (
          <TodoMainFooter
            filterTodos={filterTodos}
            todos={todos}
            onFilterTodos={setFilterTodos}
            setTodos={setTodos}
            counter={counter}
            setClearButton={setClearButton}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !notificationError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setNotificationError(false)}
        />
        {errorTodos && !loadingTodos && <span>Unable to load todos</span>}
        {errorTitle && <span>Title should not be empty</span>}
        {errorPostTodo && <span>Unable to add a todo</span>}
        {deleteError && <span>Unable to delete a todo</span>}
      </div>
    </div>
  );
};
