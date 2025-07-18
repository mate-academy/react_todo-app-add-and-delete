import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getTodos, createTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

import TodoHeader from './components/TodoHeader';
import TodoFooter from './components/TodoFooter';
import { UserWarning } from './UserWarning';
import ErrorNotification from './components/ErrorNotification';

import './styles/index.scss';
import './styles/todoapp.scss';
import TodoItem from './components/TodoItem';

export type FilterKey = 'all' | 'active' | 'completed';
const FILTER_MAP: Record<FilterKey, (todo: Todo) => boolean> = {
  all: () => true,
  active: (todo: Todo) => !todo.completed,
  completed: (todo: Todo) => todo.completed,
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      let key: FilterKey = 'all';

      if (hash === '#/active') {
        key = 'active';
      } else if (hash === '#/completed') {
        key = 'completed';
      }

      setFilter(key);
    };

    window.addEventListener('hashchange', onHashChange);
    onHashChange();

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    setErrorMessage('');
    setIsLoading(true);
    getTodos()
      .then(data => setTodos(data))
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  const activeCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  );
  const completedCount = useMemo(
    () => todos.filter(t => t.completed).length,
    [todos],
  );
  const filteredTodos = useMemo(
    () => todos.filter(todo => FILTER_MAP[filter](todo)),
    [todos, filter],
  );

  // Handler dodawania (title z Header)
  const handleAdd = async (title: string): Promise<void> => {
    const trimmed = title.trim();

    if (!trimmed) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    });
    setIsAdding(true);

    try {
      const created = await createTodo({
        userId: USER_ID,
        title: trimmed,
        completed: false,
      });

      setTodos(prev => [...prev, created]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw error;
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    setErrorMessage('');
    setLoadingTodoIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodoIds(prev => prev.filter(x => x !== id));
    }
  };

  const handleClearCompleted = async (): Promise<void> => {
    setErrorMessage('');

    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    if (completedIds.length === 0) {
      return;
    }

    setLoadingTodoIds(prev => [...prev, ...completedIds]);

    const results = await Promise.allSettled(
      completedIds.map(id => deleteTodo(id)),
    );

    const succeeded = completedIds.filter(
      (_, idx) => results[idx].status === 'fulfilled',
    );

    if (succeeded.length > 0) {
      setTodos(prev => prev.filter(t => !succeeded.includes(t.id)));
    }

    if (results.some(r => r.status === 'rejected')) {
      setErrorMessage('Unable to delete a todo');
    }

    setLoadingTodoIds(prev => prev.filter(id => !completedIds.includes(id)));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          isLoading={isLoading || isAdding}
          onAdd={handleAdd}
          inputRef={inputRef}
        />

        {isLoading && <div className="loading">Loading...</div>}

        {!isLoading && (
          <>
            {todos.length > 0 && (
              <section className="todoapp__main" data-cy="TodoList">
                {filteredTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    isBusy={loadingTodoIds.includes(todo.id)}
                    globalLoading={isLoading}
                    onDelete={() => handleDelete(todo.id)}
                    onToggle={() => {}}
                  />
                ))}

                {tempTodo && (
                  <TodoItem
                    key={tempTodo.id}
                    todo={tempTodo}
                    isBusy={true}
                    globalLoading={false}
                    onDelete={() => {}}
                    onToggle={() => {}}
                  />
                )}
              </section>
            )}

            {todos.length > 0 && (
              <TodoFooter
                activeCount={activeCount}
                completedCount={completedCount}
                currentFilter={filter}
                onFilterChange={setFilter}
                onClearCompleted={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>
      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};

export default App;
