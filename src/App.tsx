import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { getTodos, updateTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './utils/ErrorMessage';
import { Notification } from './component/Notification';
import { NewTodo } from './component/NewTodo';
import { TodoList } from './component/TodoList';
import { Footer } from './component/Footer';
import { FilterType } from './component/Filter';

const FILTERS = {
  all: 'all',
  active: 'active',
  completed: 'completed',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  // Встановлюємо тип ErrorMessage замість string | null
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.None);

  const [filter, setFilter] = useState<FilterType>('all');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [focusKey, setFocusKey] = useState(0);

  const newTodoRef = useRef<HTMLInputElement>(null);

  const addLoading = (id: number) =>
    setLoadingIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  const removeLoading = (id: number) =>
    setLoadingIds(prev => prev.filter(lid => lid !== id));

  useEffect(() => {
    setLoading(true);
    setError(ErrorMessage.None);

    getTodos()
      .then(data => setTodos(data))
      .catch(() => setError(ErrorMessage.Load))
      .finally(() => setLoading(false));
  }, []);

  const visibleTodos = todos.filter(todo => {
    if (filter === FILTERS.active) {
      return !todo.completed;
    }

    if (filter === FILTERS.completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(
    todo => !todo.completed && !todo.isTemp,
  ).length;
  const completedTodosCount = todos.filter(
    todo => todo.completed && !todo.isTemp,
  ).length;

  if (!USER_ID) {
    return null;
  }

  const handleToggleAll = async () => {
    if (!todos.length) {
      return;
    }

    const allCompleted = todos.every(t => t.completed);
    const newStatus = !allCompleted;
    const onlyChanged = todos.filter(t => t.completed !== newStatus);

    if (!onlyChanged.length) {
      return;
    }

    onlyChanged.forEach(t => addLoading(t.id));

    try {
      const results = await Promise.allSettled(
        onlyChanged.map(t => updateTodo(t.id, { completed: newStatus })),
      );

      const updatedTodos: Todo[] = [];

      results.forEach(res => {
        if (res.status === 'fulfilled') {
          updatedTodos.push(res.value);
        } else {
          setError(ErrorMessage.Update);
        }
      });

      setTodos(prev =>
        prev.map(t => updatedTodos.find(u => u.id === t.id) || t),
      );
    } finally {
      onlyChanged.forEach(t => removeLoading(t.id));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed);

    completedTodos.forEach(t => addLoading(t.id));

    const results = await Promise.allSettled(
      completedTodos.map(t => deleteTodo(t.id)),
    );

    const failedIds = completedTodos
      .filter((_, i) => results[i].status === 'rejected')
      .map(t => t.id);

    completedTodos.forEach(t => removeLoading(t.id));

    setTodos(prev =>
      prev.filter(t => !t.completed || failedIds.includes(t.id)),
    );

    if (failedIds.length > 0) {
      setError(ErrorMessage.Delete);
    }

    setFocusKey(k => k + 1);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {(todos.length > 0 || isTyping) && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active:
                  todos.length > 0 && completedTodosCount === todos.length,
              })}
              data-cy="ToggleAllButton"
              disabled={completedTodosCount === 0}
              onClick={handleToggleAll}
            />
          )}

          <NewTodo
            setTodos={setTodos}
            onTypingChange={setIsTyping}
            setError={setError}
            newTodoRef={newTodoRef}
            focusKey={focusKey}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          loading={loading}
          setTodos={setTodos}
          loadingIds={loadingIds}
          addLoading={addLoading}
          removeLoading={removeLoading}
          setError={setError}
          newTodoRef={newTodoRef}
        />

        {todos.length > 0 && (
          <Footer
            activeCount={activeTodosCount}
            completedCount={completedTodosCount}
            currentFilter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <Notification
        message={error}
        onHide={() => setError(ErrorMessage.None)}
      />
    </div>
  );
};
