/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as todosService from './api/todos';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => {
        setLoading(false);
        if (query !== '') {
          focusInput();
        }
      });
  }, []);

  if (error !== '') {
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim() === '') {
      setError('Title should not be empty');

      return;
    }

    setLoading(true);

    const temporaryTodo = {
      id: 0,
      title: query.trim(),
      userId: todosService.USER_ID,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    try {
      const createdTodo: Todo = await todosService.postTodo(temporaryTodo);

      setTodos((currentTodos: Todo[]) => [...currentTodos, createdTodo]);
      setQuery('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setLoading(false);

      focusInput();
    }
  };

  const handleToggle = (todoId: number) => {
    setLoading(true);

    todosService
      .patchTodo(todos.find(todo => todo.id === todoId).id, {
        completed: !todos.find(todo => todo.id === todoId).completed,
      })
      .then(() => {
        setTimeout(() => {
          setTodos(currentTodos =>
            currentTodos.map(todo =>
              todo.id === todoId
                ? { ...todo, completed: !todo.completed }
                : todo,
            ),
          );
          setLoading(false);
        }, 500);
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() => setLoading(false));
  };

  const deleteTodo = (todoId: number) => {
    setLoading(true);
    todosService
      .deleteTodo(todoId)
      .then(() =>
        setTimeout(() => {
          setTodos(currentTodos => {
            return currentTodos.filter(todo => todo.id !== todoId);
          });

          setLoading(false);
        }, 500),
      )
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => focusInput());
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === Status.Active) {
      return !todo.completed;
    }

    if (filter === Status.Completed) {
      return todo.completed;
    }

    return todo;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onQuery={setQuery}
          loading={loading}
          inputRef={inputRef}
          onSubmit={handleSubmit}
          query={query}
        />
        <TodoList
          onToggle={handleToggle}
          onDeleteTodo={deleteTodo}
          loading={loading}
          filtered={filteredTodos}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            onFilter={setFilter}
            onError={setError}
            onTodos={setTodos}
            todos={todos}
            filter={filter}
            focus={focusInput}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: error === '' },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
