/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import './styles/index.scss';
import { getTodos, USER_ID, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { useState } from 'react';
// import { client } from './utils/fetchClient';
import cn from 'classnames';
import { TodoFilter } from './types/Filters';
import { ErrorTypes } from './types/ErrorTypes';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer/Footer';
import { NewTodo } from './components/NewTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [newTodo, setNewTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setError(null);
    setLoading(true);

    getTodos()
      .then(receivedTodos => {
        setTodos(receivedTodos);
      })
      .catch(() => {
        setError(ErrorTypes.LoadTodos);
        const timeoutId = setTimeout(() => {
          setError(null);
        }, 3000);

        return () => clearTimeout(timeoutId);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const visibleTodos = todos.filter((todo: Todo) => {
    switch (filter) {
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleFilterChange = (newFilter: TodoFilter) => {
    setFilter(newFilter);
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isAdding) {
      return;
    }

    const title = newTodo.trim();

    if (title === '') {
      setError(ErrorTypes.EmptyTitle);

      return;
    }

    setIsAdding(true);

    const newTodoItem: Todo = {
      title: title,
      completed: false,
      id: 0,
      userId: USER_ID,
    };

    setTempTodo(newTodoItem);

    addTodo(newTodoItem)
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .then(({ id, userId, title, completed }) => {
        const todo: Todo = {
          id,
          userId,
          title,
          completed,
        };

        setTodos(prevTodos => [...prevTodos, todo]);
        setNewTodo('');
      })
      .catch(() => {
        setError(ErrorTypes.AddTodo);
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
        inputRef.current?.focus();
      });
  };

  const handleDeleteTodo = (id: number) => {
    const todoToDelete = todos.find(todo => todo.id === id);

    if (!todoToDelete) {
      return;
    }

    setDeletingIds(prevIds => [...prevIds, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(ErrorTypes.DeleteTodo);
      })
      .finally(() => {
        setDeletingIds(prevIds => prevIds.filter(foundId => foundId !== id));
      });

    inputRef.current?.focus();
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const idsCompleted = completedTodos.map(todo => todo.id);

    if (idsCompleted.length === 0) {
      return;
    }

    setDeletingIds(prevIds => [...prevIds, ...idsCompleted]);

    Promise.allSettled(idsCompleted.map(id => deleteTodo(id)))
      .then(results => {
        const successfulIds: number[] = [];
        let hasRejected = false;

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successfulIds.push(idsCompleted[index]);
          } else {
            hasRejected = true;
          }
        });

        if (successfulIds.length > 0) {
          setTodos(prevTodos =>
            prevTodos.filter(todo => !successfulIds.includes(todo.id)),
          );
        }

        if (hasRejected) {
          setError(ErrorTypes.DeleteTodo);
        }
      })
      .finally(() => {
        setDeletingIds(prevIds =>
          prevIds.filter(id => !idsCompleted.includes(id)),
        );
      });

    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <NewTodo
            ref={inputRef}
            onChange={setNewTodo}
            onSubmit={handleAddTodo}
            newTodo={newTodo}
            disabled={isAdding}
          />
        </header>

        {loading && <div className="loader"></div>}

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          onDeleteTodo={handleDeleteTodo}
          deletingIds={deletingIds}
        />

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            currentFilter={filter}
            onFilterChange={handleFilterChange}
            todos={todos}
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
          { ' hidden': !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
