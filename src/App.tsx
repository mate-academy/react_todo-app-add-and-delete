/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import TodoList from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMassage } from './types/ErrorMassage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [errorMessage, setErrorMessage] = useState<string>(ErrorMassage.reset);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMassage.load);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(ErrorMassage.reset);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const getFilteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const handleTodoAdded = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, { completed });

      setTodos(prevTodos => {
        return prevTodos.map(todo => (todo.id === id ? updatedTodo : todo));
      });
    } catch (error) {
      setErrorMessage(ErrorMassage.update);
    } finally {
      setLoadingTodoId(null);
    }
  };

  const handleAddTodoError = (error: string) => {
    setErrorMessage(error);
  };

  const handleCloseError = () => {
    setErrorMessage(ErrorMassage.reset);
  };

  const handleAddingStart = () => {
    setIsLoading(true);
  };

  const handleAddingEnd = () => {
    setIsLoading(false);
  };

  const deletedTodo = (todoId: number) => {
    todoService.deletedTodo(todoId);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          onTodoAdded={handleTodoAdded}
          onError={handleAddTodoError}
          onAddingStart={handleAddingStart}
          onAddingEnd={handleAddingEnd}
          isAdding={isLoading}
        />
        <TodoList
          todos={getFilteredTodos}
          onToggleTodo={handleToggleTodo}
          loadingTodoId={loadingTodoId}
          deletedTodo={deletedTodo}
          setIsLoading={setIsLoading}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={e => {
                  e.preventDefault();
                  setFilter(Filter.all);
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={e => {
                  e.preventDefault();
                  setFilter(Filter.active);
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={e => {
                  e.preventDefault();
                  setFilter(Filter.completed);
                }}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleCloseError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
