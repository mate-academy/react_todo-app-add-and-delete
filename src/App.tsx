/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as todoServise from './api/todos';
import { Todo } from './types/Todo';
import { TodoList, Footer, Header, Error, UserWarning } from './components';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all');

  const errorTimerId = useRef(0);
  const showError = (message: string) => {
    setErrorMessage(message);
    window.clearTimeout(errorTimerId.current);
    errorTimerId.current = window.
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const activeTodosCount = () => todos.filter(todo => !todo.completed).length;

  const hasCompleted = () => todos.some(todo => todo.completed);

 

  useEffect(() => {
    setErrorMessage('');
    todoServise
      .getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, []);

  function handleHideError() {
    setErrorMessage('');
  }



  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') {
        return !todo.completed;
      }

      if (filter === 'completed') {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);

  if (!todoServise.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todos={todos} />

        {todos.length > 0 && <TodoList visibleTodos={visibleTodos} />}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount()}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={hasCompleted()}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} handleHideError={handleHideError}/>
    </div>
  );
};
