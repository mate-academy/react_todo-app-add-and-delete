/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { Filter } from './types/Filter';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch (err) {
        setErrorMessage(ErrorMessage.LOAD_TODOS);
      } finally {
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      }
    };

    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSetFilter = (filterType: Filter) => {
    setFilter(filterType);
  };

  const handleAddTodo = (newTodo: Todo) => {
    setTemporaryTodo(null);
    setTodos(prevState => [...prevState, newTodo]);
  };

  const handleAddTemporaryTodo = (tempTodo: Todo | null) => {
    setTemporaryTodo(tempTodo);
  };

  const handleSetError = (error: ErrorMessage | null) => {
    setErrorMessage(error);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(prevState => prevState.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(ErrorMessage.DELETE_TODO);
    } finally {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const handleDeleteCompletedTodos = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed);

      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );

      const successfullyDeletedIds = completedTodos
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
      );

      const failedDeletes = completedTodos.filter(
        (_, index) => results[index].status === 'rejected',
      );

      if (failedDeletes.length > 0) {
        setErrorMessage(ErrorMessage.DELETE_TODO);
      }
    } catch {
      setErrorMessage(ErrorMessage.DELETE_TODO);
    } finally {
      inputRef.current?.focus();

      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleToggleTodoStatus = (id: number) => {
    setTodos(prevState =>
      prevState.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          onAddTemporaryTodo={handleAddTemporaryTodo}
          onError={handleSetError}
          inputRef={inputRef}
        />
        <TodoList
          temporaryTodo={temporaryTodo}
          todos={filteredTodos}
          onDeleteTodo={handleDelete}
          inputRef={inputRef}
          onToggleTodoStatus={handleToggleTodoStatus}
        />
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={handleSetFilter}
            onClearCompleted={handleDeleteCompletedTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
        {errorMessage}
      </div>
    </div>
  );
};
