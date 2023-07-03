import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { createTodo, getTodos } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Notification } from './components/Notification/Notification';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoItem } from './components/TodoItem';

const USER_ID = 10919;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');
  const [completionStatus, setCompletionStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const visibleTodos = useMemo(() => {
    switch (completionStatus) {
      case 'All':
        return todos;
      case 'Active':
        return todos.filter(todo => !todo.completed);
      case 'Completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, completionStatus]);

  const addNewTodo = async (newTitle:string) => {
    try {
      const newTodo = {
        title: newTitle,
        userId: USER_ID,
        completed: false,
      };

      setIsLoading(true);

      const createdTodo = await createTodo(USER_ID, newTodo);

      setTempTodo({
        id: 0,
        title: newTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos((prevTodos) => [
        ...prevTodos,
        ...(Array.isArray(createdTodo) ? createdTodo : [createdTodo]),
      ]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={setError}
          addNewTodo={addNewTodo}
          isLoading={isLoading}
        />

        {todos.length > 0
          && <TodoList todos={visibleTodos} isLoading={isLoading} />}
        {tempTodo && <TodoItem todo={tempTodo} isLoading={isLoading} />}

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${todos.length} items left`}
            </span>

            <TodoFilter
              completionStatus={completionStatus}
              setCompletionStatus={setCompletionStatus}
            />

            <button
              type="button"
              className={cn({
                'todoapp__clear-completed': todos.some(todo => todo.completed),
                'todoapp__clear-hidden': !todos.some(todo => todo.completed),
              })}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      {error.length > 0 && <Notification error={error} setError={setError} />}
    </div>
  );
};
