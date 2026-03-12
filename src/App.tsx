/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { addTodo, deleteTodo, getTodos, patchTodo, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { CreateForm } from './components/CreateForm';
import classNames from 'classnames';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todosForView, setTodosForView] = useState<Todo[]>([]);
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  //const [loading, setLoading] = useState(false);
  const [filterBy, setFilterBy] = useState(FilterStatus.all);

  const [errorMessage, setErrorMessage] = useState(ErrorMessage.notError);

  const setFilterValue = useCallback(setFilterBy, [filterBy]);
  const [hidenError, setHidenError] = useState(true);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [focused, setFocused] = useState(true);

  useEffect(() => {
    if (errorMessage !== ErrorMessage.notError) {
      setHidenError(false);
      const id = window.setTimeout(() => {
        setHidenError(true);
        setErrorMessage(ErrorMessage.notError);
      }, 3000);

      return () => {
        clearTimeout(id);
      };
    } else {
      setHidenError(true);
    }
  }, [errorMessage]);

  useEffect(() => {
    //setLoading(true);
    getTodos(USER_ID)
      .then(response => {
        setTodosFromServer(response);
      })
      .catch(() => setErrorMessage(ErrorMessage.unableLoad));
    //.finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const updatedCompletedTodos = todosFromServer.filter(
      item => item.completed,
    );

    setCompletedTodos(updatedCompletedTodos);
    if (filterBy === FilterStatus.completed) {
      setTodosForView(updatedCompletedTodos);

      return;
    }

    if (filterBy === FilterStatus.active) {
      setTodosForView(todosFromServer.filter(item => !item.completed));

      return;
    }

    setTodosForView(todosFromServer);
  }, [todosFromServer, filterBy]);

  const onClearCompleted = async () => {
    const promises = completedTodos.map(t => deleteTodo(t.id));
    const results = await Promise.allSettled(promises);
    const hasError = results.some(r => r.status === 'rejected');

    if (hasError) {
      setErrorMessage(ErrorMessage.unableDelete);
    }

    const succeededIds = results
      .map((r, i) => (r.status === 'fulfilled' ? completedTodos[i].id : null))
      .filter(Boolean);

    setTodosFromServer(current =>
      current.filter(t => !succeededIds.includes(t.id)),
    );
    setFocused(true);
  };

  const resetAllTodosToActive = () => {
    setTodosFromServer(current =>
      current.map(item => {
        const newTodo = { ...item, completed: false };

        patchTodo(newTodo);

        return newTodo;
      }),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: completedTodos.length === todosFromServer.length,
            })}
            data-cy="ToggleAllButton"
            onClick={resetAllTodosToActive}
          />

          <CreateForm
            onAdd={addTodo}
            updateTodos={setTodosFromServer}
            setError={setErrorMessage}
            setTempTodo={setTempTodo}
            focused={focused}
            setFocused={setFocused}
          />
        </header>

        <TodoList
          todos={todosForView}
          updateTodos={setTodosFromServer}
          setError={setErrorMessage}
          tempTodo={tempTodo}
          onFocuseInput={setFocused}
        />

        {/* Hide the footer if there are no todos */}
        {todosFromServer.length !== 0 && (
          <Footer
            countActiveTodos={todosFromServer.length - completedTodos.length}
            countCompletedTodos={completedTodos.length}
            setFilterValue={setFilterValue}
            onClearCompleted={onClearCompleted}
            filterBy={filterBy}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        isHidenError={hidenError}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
