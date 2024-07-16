// App.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { List } from './components/List';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filter, setFilter] = useState(Filter.All);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const addTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
  };

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const filterTodos = useMemo(() => {
    let filteredTodos = todos;

    switch (filter) {
      case Filter.Active:
        filteredTodos = todos.filter(todo => !todo.completed);
        break;
      case Filter.Completed:
        filteredTodos = todos.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    return filteredTodos;
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAdd={addTodo} setError={handleError} />

        {todos.length > 0 ? (
          <List todos={filterTodos} />
        ) : (
          <p data-cy="NoTodosMessage">No todos</p>
        )}

        {todos.length > 0 && (
          <Footer
            onFilter={setFilter}
            activeTodosCount={activeTodosCount}
            currentFilter={filter}
          />
        )}
      </div>

      <Error message={errorMessage} onClose={() => setErrorMessage('')} />
    </div>
  );
};
