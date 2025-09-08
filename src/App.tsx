/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, addTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import Header from './components/Header';

enum SortType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [filter, setFilter] = useState<SortType | string>('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const todoses = async () => {
      try {
        setLoading(true);
        const data = await getTodos();

        setTodos(data);
      } catch (err) {
        setError('Unable to load todos');
        setTimeout(() => setError(null), 3000);
      } finally {
        setLoading(false);
      }
    };

    todoses();
  }, []);

  const closeError = () => {
    setError(null);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  let visibleToods = [...todos];

  if (filter === SortType.Active) {
    visibleToods = visibleToods.filter(good => !good.completed);
  }

  if (filter === SortType.Completed) {
    visibleToods = visibleToods.filter(good => good.completed);
  }

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete todo');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (title: string) => {
    const trimmed = title.trim();

    if (!trimmed) {
      setError('Title should not be empty');
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
      const newTodo = await addTodo(title);

      setTodos(prev => prev.map(todo => (todo.id === 0 ? newTodo : todo)));
    } catch {
      setTodos(prev => prev.filter(todo => todo.id !== 0));
      setError('Unable to add todo');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>{' '}
      <div className="todoapp__content">
        <Header loading={loading} onAdd={handleAdd} />

        <TodoList todos={visibleToods} onDelete={handleDelete} />

        {todos.length > 0 && (
          <Footer todos={todos} filter={filter} setFilter={setFilter} />
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
