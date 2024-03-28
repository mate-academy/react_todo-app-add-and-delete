import React, { useEffect, useState } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Error';
import { Filter } from './types/Filter';
import { filterTodo } from './utils/helpers';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(false);
  const filteredTodo = filterTodo(todos, filter);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch {
        setError(Errors.Load);
      }

      setIsLoading(false);
    };

    getData();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <TodoList filteredTodo={filteredTodo} />
        )}

        {!!todos.length && (
          <TodoFooter todos={todos} filter={filter} setFilter={setFilter} />
        )}
      </div>

      <ErrorNotification setError={setError} error={error} />
    </div>
  );
};
