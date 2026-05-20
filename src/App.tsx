import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimer = useRef<number | null>(null);

  // -------------------------
  // ERROR HANDLER
  // -------------------------
  const showError = (message: string) => {
    setError(message);

    if (errorTimer.current) {
      clearTimeout(errorTimer.current);
    }

    errorTimer.current = window.setTimeout(() => {
      setError('');
    }, 3000);
  };

  // -------------------------
  // LOAD TODOS
  // -------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch {
        showError('Unable to load todos');
      }
    };

    load();
  }, []);

  // -------------------------
  // INITIAL FOCUS
  // -------------------------
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // -------------------------
  // AUTO FOCUS AFTER ACTIONS
  // -------------------------
  const [shouldFocus, setShouldFocus] = useState(false);

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus]);

  // -------------------------
  // FILTER
  // -------------------------
  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  // -------------------------
  // ADD TODO
  // -------------------------
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = title.trim();

    if (!trimmed) {
      showError('Title should not be empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const created = await addTodo(newTodo);

      setTodos(prev => [...prev, created]);
      setTitle('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setShouldFocus(true);
    }
  };

  // -------------------------
  // DELETE TODO
  // -------------------------
  const handleDelete = async (id: number) => {
    setLoadingIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setLoadingIds(prev => prev.filter(item => item !== id));
      setShouldFocus(true);
    }
  };

  // -------------------------
  // CLEAR COMPLETED
  // -------------------------
  const handleClearCompleted = async () => {
    const completed = todos.filter(todo => todo.completed);

    await Promise.all(completed.map(todo => handleDelete(todo.id)));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all" />

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={handleDelete}
              loadingIds={loadingIds}
            />

            {tempTodo && <TodoList todos={[tempTodo]} loadingIds={[0]} />}

            {todos.length > 0 && (
              <Footer
                todos={todos}
                filter={filter}
                setFilter={setFilter}
                onClearCompleted={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError('')} />
    </div>
  );
};
