/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { FilterStatus, ErrorText } from './types/ui';

const TEMP_TODO_ID = 0;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(() => setErrorMessage(''), 3000);

    return () => window.clearTimeout(timerId);
  }, [errorMessage]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorText.Load))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    newTodoFieldRef.current?.focus();
  }, [todos.length, isAdding, loadingTodoIds.length, tempTodo]);

  const visibleTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return todos.filter(t => !t.completed);
      case FilterStatus.Completed:
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmed = newTitle.trim();

    if (!trimmed) {
      setErrorMessage(ErrorText.Empty);

      return;
    }

    setIsAdding(true);

    const temp: Todo = {
      id: TEMP_TODO_ID,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const created = await createTodo(trimmed);

      setTodos(prev => [...prev, created]);
      setNewTitle('');
    } catch {
      setErrorMessage(ErrorText.Add);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
      newTodoFieldRef.current?.focus();
    }
  };

  const handleDelete = async (todoId: number) => {
    setErrorMessage('');
    setLoadingTodoIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(t => t.id !== todoId));
    } catch {
      setErrorMessage(ErrorText.Delete);
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
      newTodoFieldRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed);

    if (!completedTodos.length) {
      return;
    }

    const ids = completedTodos.map(t => t.id);

    setLoadingTodoIds(prev => [...prev, ...ids]);

    const results = await Promise.allSettled(ids.map(id => deleteTodo(id)));

    const succeededIds = ids.filter(
      (_, i) => results[i].status === 'fulfilled',
    );
    const hasAnyError = results.some(r => r.status === 'rejected');

    if (succeededIds.length) {
      setTodos(prev => prev.filter(t => !succeededIds.includes(t.id)));
    }

    if (hasAnyError) {
      setErrorMessage(ErrorText.Delete);
    }

    setLoadingTodoIds(prev => prev.filter(id => !ids.includes(id)));
    newTodoFieldRef.current?.focus();
  };

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const allCompleted = todos.length > 0 && activeTodosCount === 0;
  const hasCompleted = todos.some(t => t.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          showToggle={!!todos.length}
          allCompleted={allCompleted}
          newTitle={newTitle}
          isAdding={isAdding}
          onChangeTitle={setNewTitle}
          onSubmit={handleSubmit}
          inputRef={newTodoFieldRef}
        />

        {(!!todos.length || isLoading) && (
          <section className="todoapp__main" data-cy="TodoList">
            {isLoading && (
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )}

            {visibleTodos.map(todo => {
              const isRowLoading = loadingTodoIds.includes(todo.id);

              return (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isLoading={isRowLoading}
                  onToggle={() => {}}
                  onDelete={() => handleDelete(todo.id)}
                  onRename={() => {}}
                />
              );
            })}

            {tempTodo && (
              <TodoItem
                key="temp"
                todo={tempTodo}
                isLoading
                onToggle={() => {}}
                onDelete={() => {}}
                onRename={() => {}}
              />
            )}
          </section>
        )}

        <Footer
          countActive={activeTodosCount}
          todosLength={todos.length}
          current={filterStatus}
          setFilter={setFilterStatus}
          hasCompleted={hasCompleted}
          onClearCompleted={handleClearCompleted}
        />
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
