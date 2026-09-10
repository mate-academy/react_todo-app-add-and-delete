import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

const ERROR_HIDE_DELAY = 3000;

function getVisibleTodos(todos: Todo[], status: Status): Todo[] {
  switch (status) {
    case Status.Active:
      return todos.filter(todo => !todo.completed);
    case Status.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.None);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const timerId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (message: ErrorMessage) => {
    window.clearTimeout(timerId.current);
    setErrorMessage(message);

    timerId.current = window.setTimeout(() => {
      setErrorMessage(ErrorMessage.None);
    }, ERROR_HIDE_DELAY);
  };

  useEffect(() => {
    setErrorMessage(ErrorMessage.None);

    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load));

    return () => window.clearTimeout(timerId.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, status),
    [todos, status],
  );

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessage.Title);

      return;
    }

    setErrorMessage(ErrorMessage.None);
    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    addTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setTitle('');
      })
      .catch(() => showError(ErrorMessage.Add))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDelete = (todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => showError(ErrorMessage.Delete))
      .finally(() => {
        setLoadingTodoIds(current => current.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const idsToDelete = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(current => [...current, ...idsToDelete]);

    Promise.all(
      idsToDelete.map(id =>
        deleteTodo(id)
          .then(() => ({ id, success: true }))
          .catch(() => ({ id, success: false })),
      ),
    ).then(results => {
      const successIds = results.filter(r => r.success).map(r => r.id);

      if (results.some(r => !r.success)) {
        showError(ErrorMessage.Delete);
      }

      setTodos(current =>
        current.filter(todo => !successIds.includes(todo.id)),
      );
      setLoadingTodoIds(current =>
        current.filter(id => !idsToDelete.includes(id)),
      );
      inputRef.current?.focus();
    });
  };

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          hasTodos={todos.length > 0}
          isAllCompleted={activeTodosCount === 0}
          title={title}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          inputRef={inputRef}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              loadingTodoIds={loadingTodoIds}
              onDelete={handleDelete}
            />

            <TodoFooter
              activeTodosCount={activeTodosCount}
              hasCompletedTodos={completedTodos.length > 0}
              status={status}
              onStatusChange={setStatus}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(ErrorMessage.None)}
      />
    </div>
  );
};
