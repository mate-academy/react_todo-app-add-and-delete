/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';

const USER_ID = 11359;

enum QueryTodos {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

export const App: React.FC = () => {
  const [myTodos, setMyTodos] = useState<Todo[]>([]);
  const [errorMassege, setErrorMassege] = useState('');
  const [query, setQuery] = useState<string>(QueryTodos.all);
  const [isCompleted, setIsCompleted] = useState(false);

  function hideError() {
    setTimeout(() => setErrorMassege(''), 3000);
  }

  function isCompletedTodo() {
    return myTodos.some(todo => todo.completed);
  }

  function getNumberActiveTodos(items: Todo[]) {
    const activeTodos = items.filter(todo => !todo.completed);

    return activeTodos.length;
  }

  if (isCompletedTodo()) {
    setIsCompleted(true);
  }

  const numberOfActive = useMemo(() => {
    return getNumberActiveTodos(myTodos);
  }, [myTodos]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todos) => {
        setMyTodos(todos);
      })
      .catch(() => {
        setErrorMassege('unable to load todos');
        hideError();
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function filterTodos(param: string) {
    switch (param) {
      case QueryTodos.active: {
        const activeTodos = myTodos.filter(todo => !todo.completed);

        return activeTodos;
      }

      case QueryTodos.completed: {
        const completedTodos = myTodos.filter(todo => todo.completed);

        return completedTodos;
      }

      default:
        return myTodos;
    }
  }

  function removeTodoFromList(todoId: number) {
    setMyTodos(currentTodos => {
      const deletedTodo = currentTodos.find(todo => todo.id === todoId);
      let index: number;

      if (deletedTodo) {
        index = currentTodos.indexOf(deletedTodo);
        currentTodos.splice(index, 1);
      }

      return [...currentTodos];
    });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMassege={setErrorMassege}
          hideError={() => hideError()}
          userId={USER_ID}
          addTodo={(newTodo) => setMyTodos(currentTodos => {
            return [...currentTodos, newTodo];
          })}
        />
        <Main
          todos={filterTodos(query)}
          removeTodo={(todoId: number) => removeTodoFromList(todoId)}
          setErrorMassege={setErrorMassege}
          hideError={() => hideError()}
        />

        {!!myTodos.length && (
          <Footer
            changeQuery={setQuery}
            isCompleted={isCompleted}
            numberActive={numberOfActive}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {errorMassege && (
        <div
          className={`notification is-danger
                   is-light
                   has-text-weight-normal
                   ${!errorMassege && 'hidden'}`}
        >
          <button
            onClick={() => setErrorMassege('')}
            type="button"
            className="delete"
          />

          {/* show only one message at a time */}
          {errorMassege}
        </div>
      )}
    </div>
  );
};
