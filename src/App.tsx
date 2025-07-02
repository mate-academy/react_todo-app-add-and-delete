/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { StatusFilter } from './types/StatusFilter';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import classNames from 'classnames';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoValue, setTodoValue] = useState<string>('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.All);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [deletingTodos, setDeletingTodos] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = todos.filter(todo => {
    if (filter === StatusFilter.Active) {
      return !todo.completed;
    }

    if (filter === StatusFilter.Completed) {
      return todo.completed;
    }

    return true;
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedValue = todoValue.trim();

    if (trimmedValue === '') {
      setError('Title should not be empty');

      return;
    }

    setIsAdding(true);

    setTempTodo({
      id: 0,
      title: trimmedValue,
      completed: false,
      userId: USER_ID,
    });

    createTodo(trimmedValue)
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setTodoValue('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleDelete = (todoId: number) => {
    setDeletingTodos([...deletingTodos, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodos(prev => prev.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  setTimeout(() => {
    inputRef.current?.focus();
  }, 0);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    let completedCount = completedTodos.length;

    completedTodos.forEach(todo => {
      setDeletingTodos(prev => [...prev, todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setError('Unable to delete a todo');
        })
        .finally(() => {
          setDeletingTodos(prev => prev.filter(id => id !== todo.id));
          completedCount--;

          if (completedCount === 0) {
            inputRef.current?.focus();
          }
        });
    });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const shouldShowMain = todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoValue={todoValue}
          setTodoValue={setTodoValue}
          handleSubmit={handleSubmit}
          isAdding={isAdding}
          allCompleted={todos.length > 0 && todos.every(todo => todo.completed)}
          inputRef={inputRef}
        />

        {loading && (
          <div className="has-text-centered p-4" data-cy="Loading">
            Loading...
          </div>
        )}

        {!loading && shouldShowMain && (
          <TodoList
            todos={filteredTodos}
            deletingTodos={deletingTodos}
            onDelete={handleDelete}
          />
        )}

        {!loading && tempTodo && (
          <TodoList
            todos={[tempTodo]}
            deletingTodos={[0]}
            onDelete={() => {}}
            isTemp
          />
        )}

        {!loading && shouldShowMain && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
