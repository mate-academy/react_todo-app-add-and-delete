/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { createNewTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FilterType } from './types/filterType';
import { ErrorMessages } from './types/Errors';

export const App: React.FC = () => {
  const inputField = React.useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);

  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number[]>([]);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      case FilterType.All:
      default:
        return true;
    }
  });

  useEffect(() => {
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessages.LoadTodos);
      });
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const errorTimer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(errorTimer);
  }, [error]);

  useEffect(() => {
    if (!loading) {
      inputField.current?.focus();
    }
  }, [loading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessages.EmptyTitle);

      return;
    }

    setLoading(true);

    const tempTodoElement: Todo = {
      userId: USER_ID,
      id: 0,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(tempTodoElement);

    createNewTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTitle('');
      })
      .catch(() => setError(ErrorMessages.AddTodo))
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setDeletingTodoId(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        inputField.current?.focus();
      })
      .catch(() => setError(ErrorMessages.DeleteTodo))
      .finally(() => {
        setDeletingTodoId(prev => prev.filter(todo => todo !== id));
      });
  };

  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => handleDeleteTodo(todo.id));
  };

  const allTodosIsComplited = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

  const todoIsComplited = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allTodosIsComplited={allTodosIsComplited}
          title={title}
          setTitle={setTitle}
          inputField={inputField}
          loading={loading}
          handleSubmit={handleSubmit}
        />
        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            deletingTodoId={deletingTodoId}
            onDelete={handleDeleteTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            todoIsComplited={todoIsComplited}
            activeTodosCount={activeTodosCount}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
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
        {/* show only one message at a time */}

        {error}
      </div>
    </div>
  );
};
