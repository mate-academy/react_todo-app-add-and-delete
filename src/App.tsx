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

    try {
      const request = createTodo(trimmed);

      setTempTodo(temp);

      const created = await request;

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

  const removeTodo = async (todoId: number) => {
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

  const handleDelete = (todoId: number) => {
    setErrorMessage('');

    return removeTodo(todoId);
  };

  const completedTodosToDelete = todos.filter(
    todo => todo.completed && !loadingTodoIds.includes(todo.id),
  );

  const handleClearCompleted = async () => {
    setErrorMessage('');
    await Promise.all(completedTodosToDelete.map(todo => removeTodo(todo.id)));
  };

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const allCompleted = todos.length > 0 && activeTodosCount === 0;

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

        {(!!todos.length || isLoading || tempTodo) && (
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
                  onDelete={handleDelete}
                />
              );
            })}

            {tempTodo && <TodoItem key="temp" todo={tempTodo} isLoading />}
          </section>
        )}

        <Footer
          countActive={activeTodosCount}
          todosLength={todos.length}
          current={filterStatus}
          setFilter={setFilterStatus}
          canClearCompleted={completedTodosToDelete.length > 0}
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
