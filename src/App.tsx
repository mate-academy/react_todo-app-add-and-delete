import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessages } from './types/Errors';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { FilterTypes } from './types/FilterTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | ''>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterTypes>(
    FilterTypes.All,
  );
  const [loading, setLoading] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disabledButton, setDisabledButton] = useState(true);

  const loadTodos = () => {
    todoService
      .getTodos()
      .then((todosList: Todo[]) => {
        setTodos(todosList);
      })
      .catch(() => setErrorMessage(ErrorMessages.Load));
  };

  const filteredTodos = useMemo(() => {
    if (selectedFilter === 'Active') {
      return [...todos].filter(todo => !todo.completed);
    }

    if (selectedFilter === 'Completed') {
      return [...todos].filter(todo => todo.completed);
    }

    return todos;
  }, [selectedFilter, todos]);

  useEffect(loadTodos, []);
  useEffect(() => {
    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTodos={setTodos}
          onErrorMessage={setErrorMessage}
          onLoading={setLoading}
          onTempTodo={setTempTodo}
          todos={todos}
          disabledButton={disabledButton}
          loading={loading}
        />

        <TodoList
          todos={todos}
          filteredTodos={filteredTodos}
          onTodos={setTodos}
          onLoading={setLoading}
          loading={loading}
          tempTodo={tempTodo}
          onErrorMessage={setErrorMessage}
          onDisabledButton={setDisabledButton}
        />
        {!!todos.length && (
          <Footer
            todos={todos}
            filterType={selectedFilter}
            onFilterType={setSelectedFilter}
            onTodos={setTodos}
            onLoading={setLoading}
            onErrorMessage={setErrorMessage}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
