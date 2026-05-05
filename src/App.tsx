/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorMessages, Todo } from './types/Types';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotifications } from './components/ErrorNotifications';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.empty,
  );
  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const showError = (message: ErrorMessages) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(ErrorMessages.empty);
    }, 3000);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(ErrorMessages.empty);

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessages.notBeEmpty);
      inputRef.current?.focus();

      return;
    }

    setIsSubmiting(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    });

    createTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setTitle('');
      })
      .catch(() => {
        showError(ErrorMessages.addError);
      })
      .finally(() => {
        setIsSubmiting(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    setDeletingTodoIds(current => [...current, todoId]);
    setErrorMessage(ErrorMessages.empty);

    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        showError(ErrorMessages.deleteError);
      })
      .finally(() => {
        setDeletingTodoIds(current => current.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    const completedIds = completedTodos.map(todo => todo.id);

    setErrorMessage(ErrorMessages.empty);
    setDeletingTodoIds(current => [...current, ...completedIds]);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(results => {
        const successfulIds = completedTodos
          .filter((_, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        const hasError = results.some(result => result.status === 'rejected');

        if (successfulIds.length > 0) {
          setTodos(current =>
            current.filter(todo => !successfulIds.includes(todo.id)),
          );
        }

        if (hasError) {
          showError(ErrorMessages.deleteError);
        }
      })
      .finally(() => {
        setDeletingTodoIds(current =>
          current.filter(id => !completedIds.includes(id)),
        );

        inputRef.current?.focus();
      });
  };

  const filteredTodos = todos.filter(post => {
    if (filter === 'active') {
      return !post.completed;
    }

    if (filter === 'completed') {
      return post.completed;
    }

    return true;
  });

  const checkCompleteAll =
    todos.length > 0 && todos.every(item => item.completed);

  const checkComplete = todos.length > 0 && todos.some(item => item.completed);

  useLayoutEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMessage(ErrorMessages.empty);
    getTodos()
      .then(data => setTodos(data))
      .catch(() => showError(ErrorMessages.loadError));
  }, []);

  useLayoutEffect(() => {
    if (!isSubmiting) {
      inputRef.current?.focus();
    }
  }, [isSubmiting]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={
                checkCompleteAll
                  ? 'todoapp__toggle-all active'
                  : 'todoapp__toggle-all'
              }
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              autoFocus
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isSubmiting}
            />
          </form>
        </header>

        <TodoList
          filteredTodos={filteredTodos}
          handleDelete={handleDelete}
          deletingTodoIds={deletingTodoIds}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            checkComplete={checkComplete}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotifications
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
