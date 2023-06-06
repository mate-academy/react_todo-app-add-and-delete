import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { Filter } from './types/Filter';

const USER_ID = 10606;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  const hasTodos = todos.length > 0;

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleFilter = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  const handleError = (newError: string) => {
    setError(newError);
  };

  const handleTempTodo = (newTodo: Todo | null) => {
    setTempTodo(newTodo);
  };

  const handleIsUpdating = (status: boolean) => {
    setIsUpdating(status);
  };

  const handleUpdatingIds = (ids: number[]) => {
    setUpdatingIds(ids);
  };

  const handleLoadTodos = () => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          userId={USER_ID}
          handleTempTodo={handleTempTodo}
          handleError={handleError}
          handleIsUpdating={handleIsUpdating}
        />

        <TodoList
          todos={todos}
          filter={filter}
          tempTodo={tempTodo}
          handleError={handleError}
          isUpdating={isUpdating}
          handleIsUpdating={handleIsUpdating}
          updatingIds={updatingIds}
          handleUpdatingIds={handleUpdatingIds}
          handleLoadTodos={handleLoadTodos}
        />

        {hasTodos && (
          <Footer
            todos={todos}
            filter={filter}
            handleFilter={handleFilter}
            handleError={handleError}
            handleIsUpdating={handleIsUpdating}
            handleUpdatingIds={handleUpdatingIds}
          />
        )}
      </div>

      {error && (
        <Notification error={error} />
      )}
    </div>
  );
};
