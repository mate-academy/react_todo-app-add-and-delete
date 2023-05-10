/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
} from 'react';
import { Header } from './components/header';
import { Main } from './components/main';
import { Footer } from './components/footer';
import { Notification } from './components/notification';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';

const USER_ID = 10283;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [error, setError] = useState<boolean | string>(false);
  const [filter, setFilter] = useState<string>('all');

  const handleSetError = (errVal: string | boolean) => {
    setError(errVal);
  };

  const loadTodos = async () => {
    try {
      await getTodos(USER_ID)
        .then(res => setTodos(res));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const HandleSelectFilter = (filterValue: string) => {
    setFilter(filterValue);
  };

  let visibleTodos: Todo[] | null = todos;

  if (filter === 'active') {
    visibleTodos = todos ? todos.filter(todo => !todo.completed) : null;
  }

  if (filter === 'completed') {
    visibleTodos = todos ? todos.filter(todo => todo.completed) : null;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header setError={handleSetError} userId={USER_ID} />
        {todos && (
          <>
            <Main todos={visibleTodos} showError={handleSetError} />
            <Footer setFilter={HandleSelectFilter} selectedFilter={filter} />
          </>
        )}
      </div>
      {error && (<Notification setError={handleSetError} errorText={error} />)}
    </div>
  );
};
