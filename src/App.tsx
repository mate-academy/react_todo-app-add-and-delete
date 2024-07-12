import React, { useEffect, useState, useRef } from 'react';
import { Todo } from './types/Todo';
import { getTodos, loadTodos } from './api/todos';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Status } from './separate/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<Status>(Status.all);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return () => {};
  }, [error]);

  const countActiveTodos = () => {
    return todos.filter(todo => !todo.completed).length;
  };

  const handleNewTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimTitle = newTodo.trim();

    if (!trimTitle) {
      setError('Title should not be empty');

      return;
    }

    const newtempTodo: Todo = {
      id: 0,
      userId: 0,
      title: trimTitle,
      completed: false,
    };

    setTempTodo(newtempTodo);
    setLoading(true);
    setInputDisabled(true);
    setError(null);

    loadTodos(trimTitle)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setNewTodo('');
        setInputDisabled(false);
        setTempTodo(null);

        setTimeout(() => {
          inputRef.current?.focus();
        });
      })
      .catch(() => {
        setTodos(prevTodos =>
          prevTodos.filter(todo => todo.id !== newtempTodo.id),
        );
        setTempTodo(null);
        setError('Unable to add a todo');
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === Status.all) {
      return true;
    }

    if (filter === Status.active) {
      return !todo.completed;
    }

    if (filter === Status.completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.length > 0 && todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />
          <form onSubmit={handleNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={newTodo}
              onChange={event => setNewTodo(event.target.value)}
              disabled={inputDisabled}
              ref={inputRef}
            />
          </form>
        </header>
        <TodoList
          todos={filteredTodos}
          loading={loading}
          onDelete={handleDeleteTodo}
          tempTodo={tempTodo}
        />
        {todos.length > 0 && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            activeCount={countActiveTodos()}
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
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
