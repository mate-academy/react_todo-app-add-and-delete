/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';

import { TodoList } from './components/TodoList';
import { NewTodoForm } from './components/NewTodoField';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { Errors } from './types/Errors';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string>(Filters.All);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState(0);
  const [isClearCompleted, setClearCompleted] = useState(false);

  function handleError(errorType: string) {
    setError(errorType);
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          handleError(Errors.loading);
        });
    }
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filter) {
        case Filters.All:
          return todo;
        case Filters.Active:
          return !todo.completed;
        case Filters.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filter]);

  const isComponentVisible = todos.length > 0;

  const handleFilter = (filterValue: string) => {
    setFilter(filterValue);
  };

  const handleErrorClose = () => {
    setError('');
  };

  const handleAddTodo = async (title: string) => {
    if (!user) {
      return;
    }

    if (!title) {
      handleError(Errors.title);
    } else {
      const newTempTodo = {
        id: 0,
        userId: user.id,
        title,
        completed: false,
      };

      setIsAdding(true);
      setTempTodo(newTempTodo);

      try {
        const newTodo = await addTodo(newTempTodo);

        setTodos((currentTodos) => [...currentTodos, newTodo]);
      } catch {
        handleError(Errors.adding);
      } finally {
        setIsAdding(false);
        setTempTodo(null);
      }
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodoId(todoId);

    try {
      await deleteTodo(todoId);
      setTodos((currentTodos) => currentTodos.filter(
        (todo) => todo.id !== todoId,
      ));
    } catch {
      handleError(Errors.delete);
    } finally {
      setDeletingTodoId(0);
    }
  };

  const handleClearCompleted = async (id: number) => {
    setClearCompleted(true);

    try {
      await deleteTodo(id);
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    } catch {
      handleError(Errors.delete);
    } finally {
      setClearCompleted(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">
        todos
      </h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <NewTodoForm
            newTodoField={newTodoField}
            onAdd={handleAddTodo}
            isAdding={isAdding}
          />
        </header>

        {isComponentVisible && (
          <TodoList
            todos={visibleTodos}
            isAdding={isAdding}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            deletingTodoId={deletingTodoId}
            isClearCompleted={isClearCompleted}
          />
        )}

        {isComponentVisible && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={handleFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {error && (
        <Error
          error={error}
          onClick={handleErrorClose}
        />
      )}
    </div>
  );
};
