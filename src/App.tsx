import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';

import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';

import { Todo } from './types/Todo';
import { getTodos } from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isErrorNotification, setIsErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterValue, setFilterValue] = useState('all');

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodos(user?.id || 0)
      .then(setTodos)
      .catch(() => {
        setIsErrorNotification(true);
        setErrorMessage('Unable to load todos');
      });
  }, [user]);

  const filteredTodos = todos.filter(({ completed }) => {
    switch (filterValue) {
      case 'active':
        return !completed;

      case 'completed':
        return completed;

      default:
        return true;
    }
  });

  const activeTodosTotal = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  const isLeftActiveTodos = activeTodosTotal === todos.length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          isLeftActiveTodos={isLeftActiveTodos}
        />
        <TodoList todos={filteredTodos} />
        {!!todos.length && (
          <Footer
            activeTodosTotal={activeTodosTotal}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
          />
        )}
      </div>

      {isErrorNotification && (
        <ErrorNotification
          errorMessage={errorMessage}
          isErrorNotification={isErrorNotification}
          setIsErrorNotification={setIsErrorNotification}
        />
      )}
    </div>
  );
};
