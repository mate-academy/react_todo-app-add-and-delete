/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessages } from './types/ErrorMessages';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { NewTodoField } from './components/NewTodoField';
import { filterTodos } from './utils/filterTodos';

const ERROR_DELAY = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<Status>(Status.All);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );

  const errorTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const newTodoField = useRef<HTMLInputElement>(null);

  const showError = (message: ErrorMessages) => {
    window.clearTimeout(errorTimerRef.current);
    setErrorMessage(message);

    errorTimerRef.current = setTimeout(() => {
      setErrorMessage(ErrorMessages.None);
    }, ERROR_DELAY);
  };

  const hideError = () => {
    window.clearTimeout(errorTimerRef.current);
    setErrorMessage(ErrorMessages.None);
  };

  useEffect(() => {
    hideError();

    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessages.UnableToLoad));

    return () => window.clearTimeout(errorTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      newTodoField.current?.focus();
    }
  }, [isSubmitting]);

  const visibleTodos = useMemo(
    () => filterTodos(todos, status),
    [todos, status],
  );

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    hideError();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessages.EmptyTitle);

      return;
    }

    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => showError(ErrorMessages.UnableToAdd))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
        newTodoField.current?.focus();
      });
  };

  const handleDelete = (todoId: number) => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => showError(ErrorMessages.UnableToDelete))
      .finally(() => {
        setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
        newTodoField.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingTodoIds(currentIds => [...currentIds, ...completedIds]);

    Promise.allSettled(
      completedIds.map(id => deleteTodo(id).then(() => id)),
    ).then(results => {
      const deletedIds = results
        .filter(
          (result): result is PromiseFulfilledResult<number> =>
            result.status === 'fulfilled',
        )
        .map(result => result.value);

      if (deletedIds.length < completedIds.length) {
        showError(ErrorMessages.UnableToDelete);
      }

      setTodos(currentTodos =>
        currentTodos.filter(todo => !deletedIds.includes(todo.id)),
      );
      setLoadingTodoIds(currentIds =>
        currentIds.filter(id => !completedIds.includes(id)),
      );
      newTodoField.current?.focus();
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <NewTodoField
            ref={newTodoField}
            title={title}
            onTitleChange={setTitle}
            onSubmit={handleSubmit}
            disabled={isSubmitting}
          />
        </header>

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            onDelete={handleDelete}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            status={status}
            onStatusChange={setStatus}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} onClose={hideError} />
    </div>
  );
};
