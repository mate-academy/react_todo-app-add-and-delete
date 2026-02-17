import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';

import { Header, HeaderRef } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';

import { Filter } from './enums/Filter';
import { ErrorMessage } from './enums/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState('');
  const [visibleError, setVisibleError] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const headerRef = useRef<HeaderRef>(null);

  const showError = (message: string) => {
    setError(message);
    setVisibleError(true);
    setTimeout(() => setVisibleError(false), 3000);
  };

  const hideError = () => setVisibleError(false);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load));
  }, []);

  const handleAdd = async (title: string): Promise<boolean> => {
    const trimmed = title.trim();

    if (!trimmed) {
      showError(ErrorMessage.EmptyTitle);
      headerRef.current?.focus();

      return false;
    }

    hideError();
    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(temp);
    setIsAdding(true);

    try {
      const newTodo = await createTodo({
        userId: USER_ID,
        title: trimmed,
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);
      setTempTodo(null);

      return true;
    } catch {
      showError(ErrorMessage.Add);
      setTempTodo(null);

      return false;
    } finally {
      setIsAdding(false);
      setTimeout(() => headerRef.current?.focus(), 0);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoadingId(id);
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      showError(ErrorMessage.Delete);
    } finally {
      setLoadingId(null);
      setTimeout(() => headerRef.current?.focus(), 0);
    }
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => handleDelete(todo.id));
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(t => !t.completed);
      case Filter.Completed:
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = todos.filter(t => !t.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header ref={headerRef} onAdd={handleAdd} disabled={isAdding} />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            loadingId={loadingId}
            onDelete={handleDelete}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            completedCount={todos.length - activeCount}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !visibleError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {error}
      </div>
    </div>
  );
};
