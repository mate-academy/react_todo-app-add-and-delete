/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, addTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import Header from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

import { ErrorMessage } from './types/ErrorMessage';
import { getVisibleTodos } from './utils/getVisibleTodos';

export enum SortType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [filter, setFilter] = useState<SortType>(SortType.All);
  const [loading, setLoading] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const fetchTodos = async () => {
      try {
        setLoading(true);
        const data = await getTodos();

        setTodos(data);
      } catch {
        setError(ErrorMessage.LoadTodos);
        setTimeout(() => setError(null), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const closeError = () => {
    setError(null);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getVisibleTodos(filter, todos);

  const handleDelete = async (id: number) => {
    setDeletingTodoId(id);
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setError(ErrorMessage.DeleteTodo);
    } finally {
      setDeletingTodoId(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleAdd = async (title: string) => {
    const trimmed = title.trim();

    if (!trimmed) {
      setError(ErrorMessage.EmptyTitle);
      setTimeout(() => setError(null), 3000);

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      title: trimmed,
      completed: false,
      userId: USER_ID,
    };

    setTodos(prev => [...prev, tempTodo]);
    setLoading(true);

    try {
      const newTodo = await addTodo(trimmed);

      setTodos(prev => prev.map(todo => (todo.id === 0 ? newTodo : todo)));
      setNewTodoTitle('');
    } catch {
      setTodos(prev => prev.filter(todo => todo.id !== 0));
      setError(ErrorMessage.AddTodo);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    setTodos(prev =>
      prev.filter(todo => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const res = results.find((_, i) => completedTodos[i].id === todo.id);

        return todo.completed ? res?.status !== 'fulfilled' : true;
      }),
    );

    if (results.some(r => r.status === 'rejected')) {
      setError(ErrorMessage.DeleteTodo);
      setTimeout(() => setError(null), 3000);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>{' '}
      <div className="todoapp__content">
        <Header
          loading={loading}
          onAdd={handleAdd}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          inputRef={inputRef}
        />

        <TodoList
          todos={visibleTodos}
          onDelete={handleDelete}
          deletingTodoId={deletingTodoId}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closeError}
        />
        {error}
      </div>
    </div>
  );
};
