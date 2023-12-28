import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { TodosList } from './components/TodosList';
import { getTodos } from './api/todos';
import { FilterBy, TodosFooter } from './components/TodosFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';

const USER_ID = 12110;

const filterTodos = (todos: Todo[], filterBy: FilterBy) => {
  switch (filterBy) {
    case 'active':
      return todos.filter(({ completed }) => !completed);

    case 'completed':
      return todos.filter(({ completed }) => completed);

    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const todos = useMemo(() => {
    return filterTodos(todosFromServer, filterBy);
  }, [filterBy, todosFromServer]);

  const completedTodosLength = useMemo(() => {
    return todosFromServer.filter(
      ({ completed }) => completed,
    ).length;
  }, [todosFromServer]);
  const activeTodosLength = todosFromServer.length - completedTodosLength;
  const isSomeActive = todosFromServer.some(({ completed }) => !completed);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodosFromServer)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setIsError(true);
      });
  }, []);

  useEffect(() => {
    const timeoutId = 0;

    if (errorMessage) {
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader isSomeActive={isSomeActive} />

        <TodosList todos={todos} />

        {todosFromServer.length > 0 && (
          <TodosFooter
            filterBy={filterBy}
            activeTodosLength={activeTodosLength}
            completedTodosLength={completedTodosLength}
            onFilterChange={setFilterBy}
          />
        )}
      </div>

      <ErrorNotification
        isHidden={!isError}
        message={errorMessage}
        onClose={() => setIsError(false)}
      />
    </div>
  );
};
