/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Filter as Filters, Todo as Todos } from './types/Todo';

import { TodoApp } from './components/TodoApp/Todoapp';
import { Todo } from './components/Todo/Todo';
import { Filter } from './components/Filter/Filter';

export const App: React.FC = () => {
  const [posts, setPosts] = useState<Todos[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filters>(Filters.all);
  const [todo] = useState<Todos>([]);

  const [errorMessage, setErrorMessage] = useState('');
  const hasTodos = posts.length > 0;

  const [tempTodo, setTempTodo] = useState<Todos | null>(null);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  useEffect(() => {
    setErrorMessage('');
    setLoading(true);
    getTodos()
      .then(setPosts)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoApp
          posts={posts}
          setPosts={setPosts}
          setErrorMessage={setErrorMessage}
          loading={loading}
          setTempTodo={setTempTodo}
        />

        {hasTodos && (
          <>
            <Todo
              posts={posts}
              setErrorMessage={setErrorMessage}
              setPosts={setPosts}
              filter={filter}
              updatingIds={updatingIds}
              setUpdatingIds={setUpdatingIds}
              tempTodo={tempTodo}
              loading={loading}
              todo={todo}
            />
            <Filter
              setErrorMessage={setErrorMessage}
              posts={posts}
              filter={filter}
              setPosts={setPosts}
              setFilter={setFilter}
            />
          </>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          onClick={() => setErrorMessage('')}
          className="delete"
        />
        <div
          className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
        >
          {errorMessage}
        </div>
      </div>
    </div>
  );
};
