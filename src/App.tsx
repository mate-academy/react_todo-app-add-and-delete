/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { Filter } from './components/Filter';
import { TodoForm } from './components/TodoForm';
import { Notifications } from './components/Notifications';
import { TodoList } from './components/TodoList';
import { FilterOptions } from './types/FilterOptions';
import { Todo } from './types/Todo';
import { getTodos, createTodo } from './api/todos';
import { UserWarning } from './UserWarning';

const USER_ID = 10873;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOptions>(FilterOptions.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosFromServer: Todo[]) => setTodos(todosFromServer))
      .catch(() => setError('Unable to get todos'));
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (error) {
      timeoutId = setTimeout(() => setError(null), 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case FilterOptions.ACTIVE:
        return activeTodos;

      case FilterOptions.COMPLETED:
        return completedTodos;

      default:
        return todos;
    }
  }, [todos, filter]);

  const addTodo = async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      setError('Unable to add todo');
    } finally {
      setTempTodo(null);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />
          <TodoForm setError={setError} addTodo={addTodo} tempTodo={tempTodo} />
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodos={loadingTodos}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <Filter filter={filter} setFilter={setFilter} />

            {completedTodos.length > 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {/* show only one message at a time */}
      {/* Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
      <Notifications error={error} setError={setError} />
    </div>
  );
};
