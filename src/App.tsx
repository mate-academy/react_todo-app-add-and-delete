/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { FilterEnum, filterTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotifications } from './components/ErrorNotifications';

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number>(0);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [inputText, setInputText] = useState('');

  const [selectedFilter, setSelectedFilter] = useState(FilterEnum.ALL);

  const [completedLentgh, setCompletedLentgh] = useState(0);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(todosFromServer => {
        setAllTodos(todosFromServer);
        setCompletedLentgh(
          todosFromServer.filter(todo => !todo.completed).length,
        );
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setCompletedLentgh(allTodos.filter(todo => !todo.completed).length);
  }, [allTodos, selectedFilter]);

  const visibleTodos = filterTodos(selectedFilter, allTodos);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          visibleTodos={visibleTodos}
          inputText={inputText}
          error={error}
          setInputText={setInputText}
          setError={setError}
          setErrorMessage={setErrorMessage}
          setAllTodos={setAllTodos}
          allTodos={allTodos}
          loading={loading}
          setLoading={setLoading}
          setTempTodo={setTempTodo}
        />
        <TodoList
          visibleTodos={visibleTodos}
          loading={loading}
          tempTodo={tempTodo}
          allTodos={allTodos}
          setAllTodos={setAllTodos}
          loadingTodoId={loadingTodoId}
          setLoadingTodoId={setLoadingTodoId}
          setLoading={setLoading}
          setError={setError}
          setErrorMessage={setErrorMessage}
          selectedFilter={selectedFilter}
        />

        {/* Hide the footer if there are no todos */}
        {allTodos.length > 0 && (
          <Footer
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            completedLentgh={completedLentgh}
            allTodos={allTodos}
            setCompletedLentgh={setCompletedLentgh}
            setAllTodos={setAllTodos}
            setError={setError}
            setErrorMessage={setErrorMessage}
            setLoading={setLoading}
          />
        )}
      </div>

      <ErrorNotifications
        error={error}
        errorMessage={errorMessage}
        setError={setError}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
