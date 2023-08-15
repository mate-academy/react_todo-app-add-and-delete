import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';

import { apiActions } from './api/apiActions';
import { TodosError } from './components/TodosError/TodosError';
import { TodosFooter } from './components/TodosFooter/TodosFooter';
import { TodosHeader } from './components/TodosHeader/TodosHeader';
import { TodosList } from './components/TodosList/TodosList';
import { getVisibleTodos } from './helpers/GetVisibleTodos';
import { Filter } from './types/Filter';
import { Error } from './types/Error';
import { UserWarning } from './UserWarning';
import { TodosContext } from './TodosContext';
import { USER_ID } from './utils/userId';

export const App: React.FC = () => {
  const [filter, setFilter] = useState(Filter.All);

  const {
    todos,
    error,
    setTodos,
    setError,
  } = useContext(TodosContext);

  useEffect(() => {
    apiActions.get(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setError(Error.Download);
      });
  }, []);

  const visibleTodos = useMemo(() => (
    getVisibleTodos(todos, filter)
  ), [todos, filter]);

  const activeTodosCount = useMemo(() => (
    getVisibleTodos(todos, Filter.Active).length
  ), [todos]);

  const isAnyTodos = todos.length > 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader />

        {isAnyTodos && <TodosList todos={visibleTodos} />}

        { isAnyTodos
          && (
            <TodosFooter
              todosCount={activeTodosCount}
              onFilter={setFilter}
              filter={filter}
            />
          )}
      </div>

      { error
        && (
          <TodosError
            errorMessage={error}
            onError={setError}
          />
        )}
    </div>
  );
};
