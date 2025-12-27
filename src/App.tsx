import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  postTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filter';
import { Errors } from './constans/errors';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<(Todo & { loading?: boolean })[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  /* Fetch todos */
  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const fetchTodos = async () => {
      try {
        setError('');
        setLoading(true);
        const data = await getTodos();

        setTodos(data);
      } catch {
        setError(Errors.LoadTodosFailed);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  /* Add todo */
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(Errors.EmptyTitle);

      return;
    }

    const tempTodo: Todo & { loading: boolean } = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
      loading: true,
    };

    setTodos(prev => [...prev, tempTodo]);
    setLoading(true);

    try {
      const newTodo = await postTodos({ title: trimmedTitle });

      setTodos(prev =>
        prev.map(todo =>
          todo === tempTodo ? { ...newTodo, loading: false } : todo,
        ),
      );

      setTitle('');
      inputRef.current?.focus();
    } catch {
      setError(Errors.AddTodoFailed);
      setTodos(prev => prev.filter(todo => todo !== tempTodo));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  /* Toggle todo */
  const toggleTodo = async (todoId: number) => {
    const currentTodo = todos.find(t => t.id === todoId);

    if (!currentTodo) {
      return;
    }

    try {
      setTodos(prev =>
        prev.map(t => (t.id === todoId ? { ...t, loading: true } : t)),
      );
      await updateTodo({ ...currentTodo, completed: !currentTodo.completed });
      setTodos(prev =>
        prev.map(t =>
          t.id === todoId
            ? { ...t, completed: !t.completed, loading: false }
            : t,
        ),
      );
      inputRef.current?.focus();
    } catch {
      setError(Errors.UpdateTodoFailed);
      setTodos(prev =>
        prev.map(t => (t.id === todoId ? { ...t, loading: false } : t)),
      );
    }
  };

  /* Delete todo */
  const deleteTodoItem = async (todoId: number) => {
    try {
      setTodos(prev =>
        prev.map(t => (t.id === todoId ? { ...t, loading: true } : t)),
      );
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(t => t.id !== todoId));
      inputRef.current?.focus();
    } catch {
      setError(Errors.DeleteTodoFailed);
      setTodos(prev =>
        prev.map(t => (t.id === todoId ? { ...t, loading: false } : t)),
      );
    }
  };

  /* Derived data */
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const allCompleted = todos.length > 0 && todos.every(t => t.completed);
  // Рахуємо лише Todo, які не completed і не loading
  const activeCount = todos.filter(t => !t.completed && !t.loading).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <Header
        allCompleted={allCompleted}
        title={title}
        setTitle={setTitle}
        onAddTodo={addTodo}
        loading={loading}
        filter={filter}
        setFilter={setFilter}
        onToggleAll={async () => {
          try {
            const newCompleted = !allCompleted;

            setTodos(prev => prev.map(t => ({ ...t, loading: true })));
            await Promise.all(
              todos.map(t => updateTodo({ ...t, completed: newCompleted })),
            );
            setTodos(prev =>
              prev.map(t => ({
                ...t,
                completed: newCompleted,
                loading: false,
              })),
            );
          } catch {
            setError(Errors.ToggleAllFailed);
            setTodos(prev => prev.map(t => ({ ...t, loading: false })));
          }
        }}
        inputRef={inputRef}
      />

      <Main
        todos={todos}
        filteredTodos={filteredTodos}
        toggleTodo={toggleTodo}
        deleteTodoItem={deleteTodoItem}
        loading={loading}
      />

      {todos.length > 0 && (
        <Footer
          todos={todos}
          activeCount={activeCount}
          filter={filter}
          setFilter={setFilter}
          onDeleteCompleted={async () => {
            const completedTodos = todos.filter(t => t.completed);

            setTodos(prev =>
              prev.map(t => (t.completed ? { ...t, loading: true } : t)),
            );

            const results = await Promise.allSettled(
              completedTodos.map(t => deleteTodo(t.id)),
            );

            const hasError = results.some(r => r.status === 'rejected');

            if (hasError) {
              setError('Unable to delete a todo'); // для тесту Cypress
            }

            // залишаємо ті, що не видалилися
            const deletedIds = completedTodos
              .filter((_, index) => results[index].status === 'fulfilled')
              .map(t => t.id);

            setTodos(prev => prev.filter(t => !deletedIds.includes(t.id)));

            inputRef.current?.focus();
          }}
        />
      )}

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
