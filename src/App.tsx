import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Filters } from './components/Filters';

import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { getTodos } from './api/todos';
import { NewTodo } from './components/NewTodo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [filterBy, setFilterBy] = useState(FilterStatus.All);

  useEffect(() => {
    getTodos(user?.id).then(setTodos);
  }, [todos]);

  const sortTodos = todos.filter((todo) => {
    switch (filterBy) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo query={query} setQuery={setQuery} todos={todos} />

        <TodoList todos={sortTodos} />

        {Boolean(todos.length) && (
          <Filters
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
          />
        )}
      </div>

      {error && <ErrorNotification setError={setError} error={error} />}
    </div>
  );
};
