/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import cn from 'classnames';
import { getTodos, createTodo, deleteTodo } from './api/todos';

import { UserWarning } from './components/UserWarning/UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './components/Filter/Filter';
import { TodoForm } from './components/TodoForm/TodoForm';

import { Filters } from './types/Filter';
import { Todo } from './types/Todo';

const USER_ID = 10930;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filters>(Filters.ALL);
  const [error, setError] = useState<string | null>(null);
  const [loadingTodo, setLoadingTodo] = useState([0]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch((fetchedError: Error) => {
        setError(fetchedError?.message ?? 'Unexpected error fetching todos');
      });
  }, []);

  useEffect(() => {
    let timeout: number;

    if (error) {
      timeout = window.setTimeout(() => setError(null), 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const addTodo = useCallback(async (todoTitle: string) => {
    try {
      const newTodo = {
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    try {
      setLoadingTodo(prevTodoId => [...prevTodoId, id]);
      await deleteTodo(id);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setTempTodo(null);
      setLoadingTodo([0]);
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleClearCompleted = () => {
    completedTodos.forEach(async (todo) => {
      await removeTodo(todo.id);
    });
  };

  const handleClearError = () => {
    setError(null);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filters.COMPLETED:
        return completedTodos;

      case Filters.ACTIVE:
        return activeTodos;

      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          {/* Add a todo on form submit */}
          <TodoForm addTodo={addTodo} setError={setError} />
        </header>

        <TodoList
          todos={visibleTodos}
          removeTodo={removeTodo}
          tempTodo={tempTodo}
          loadingTodo={loadingTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <Filter filter={filter} onFilterChange={setFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              style={{
                visibility: completedTodos.length
                  ? 'visible'
                  : 'hidden',
              }}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={handleClearError}
        />
        {error}
      </div>
    </div>
  );
};
