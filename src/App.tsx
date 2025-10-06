import React, { useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { UserWarning } from './UserWarning';
import { Todo, Filter } from './types/Todo';
import { getTodos, createTodo, deleteTodo, updateTodo } from './api';
import { ErrorType } from './types/ErrorType';

const USER_ID = 3513;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState<string>('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorType.LOAD_TODOS));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    setIsInputDisabled(true);
    event.preventDefault();

    const title = newTitle.trim();

    if (!title) {
      setError(ErrorType.EMPTY_TITLE);
      setIsInputDisabled(false);
      inputRef.current?.focus();

      return;
    }

    const temp: Todo = { id: 0, userId: USER_ID, title, completed: false };

    setTempTodo(temp);

    try {
      const created = await createTodo(title, USER_ID);

      // sync react state with cypress
      requestAnimationFrame(() => {
        setTodos(prev => [...prev, created]);
        setNewTitle('');
        setIsInputDisabled(false);
        setTempTodo(null);
      });
    } catch {
      setError(ErrorType.ADD_TODO);
      setTempTodo(null);
      setIsInputDisabled(false);
    } finally {
      // for sync with  cypress
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleDelete = async (todoId: number) => {
    setLoadingTodoId(todoId);
    // for sync with cypress
    await new Promise(resolve => setTimeout(resolve, 100));
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(t => t.id !== todoId));
    } catch {
      setError(ErrorType.DELETE_TODO);
    } finally {
      setLoadingTodoId(null);
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(t => t.completed);

    try {
      const results = await Promise.allSettled(
        completed.map(todo => deleteTodo(todo.id)),
      );

      const fulfilled = results
        .map((r, i) => ({ result: r, todo: completed[i] }))
        .filter(r => r.result.status === 'fulfilled')
        .map(r => r.todo.id);

      const rejected = results.filter(r => r.status === 'rejected');

      if (rejected.length > 0) {
        setError(ErrorType.DELETE_TODO);
      }

      setTodos(prev => prev.filter(t => !fulfilled.includes(t.id)));
    } catch {
      setError(ErrorType.DELETE_TODO);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 50));
      inputRef.current?.focus();
    }
  };

  const handleToggleStatus = async (todo: Todo) => {
    setLoadingTodoId(todo.id);
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });

      setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch {
      setError(ErrorType.UPDATE_TODO);
    } finally {
      setLoadingTodoId(null);
    }
  };

  const handleToggleAll = async () => {
    const shouldComplete = !todos.every(t => t.completed);

    try {
      const results = await Promise.allSettled(
        todos.map(t => updateTodo(t.id, { completed: shouldComplete })),
      );

      const fulfilled = results.filter(
        r => r.status === 'fulfilled',
      ) as PromiseFulfilledResult<Todo>[];

      const updated = fulfilled.map(r => r.value);

      setTodos(prev => prev.map(t => updated.find(u => u.id === t.id) || t));
    } catch {
      setError(ErrorType.UPDATE_TODOS);
    }
  };

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

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title" data-cy="AppTitle">
        todos
      </h1>

      <div className="todoapp__content">
        <Header
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          onSubmit={handleSubmit}
          onToggleAll={handleToggleAll}
          loading={isInputDisabled}
          todosCount={todos.length}
          allCompleted={todos.every(t => t.completed)}
          inputRef={inputRef}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodoId={loadingTodoId}
          onDelete={handleDelete}
          onToggle={handleToggleStatus}
        />

        {todos.length > 0 && (
          <Footer
            activeCount={todos.filter(t => !t.completed).length}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={todos.some(t => t.completed)}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError('')} />
    </div>
  );
};
