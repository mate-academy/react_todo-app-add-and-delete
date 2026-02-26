import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import Footer from './components/Footer';
import { TodoList } from './components/TodoList';
import SearchBar from './components/SearchBar';
import { ErrorType } from './enums/error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [hasError, setHasError] = useState('');
  const [loading, setLoading] = useState<number[]>([]);
  const [loadingInput, setLoadingInput] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  // eslint-disable-next-line max-len
  const [pressButtonToggleAll, setPressButtonToggleAll] = useState(null);

  useEffect(() => {
    if (!hasError) {
      return;
    }

    const timerId = setTimeout(() => {
      setHasError('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [hasError]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(error => {
        setHasError(ErrorType.LOADING);

        throw error;
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <SearchBar
          todos={todos}
          query={query}
          setQuery={setQuery}
          setHasError={setHasError}
          loadingInput={loadingInput}
          setLoadingInput={setLoadingInput}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
          pressButtonToggleAll={pressButtonToggleAll}
          setPressButtonToggleAll={setPressButtonToggleAll}
          loading={loading}
        />

        <TodoList
          todos={todos}
          setTodos={setTodos}
          sortBy={sortBy}
          tempTodo={tempTodo}
          pressButtonToggleAll={pressButtonToggleAll}
          setPressButtonToggleAll={setPressButtonToggleAll}
          setLoading={setLoading}
          loading={loading}
          setHasError={setHasError}
          setQuery={setQuery}
        />
        <Footer
          todos={todos}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setTodos={setTodos}
          loading={loading}
          setLoading={setLoading}
          setHasError={setHasError}
        />
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!hasError ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setHasError(ErrorType.RESET_ERROR)}
        />
        {hasError}
      </div>
    </div>
  );
};
