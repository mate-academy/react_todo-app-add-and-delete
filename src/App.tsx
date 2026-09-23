/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, updateTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { Filter } from './components/Filter';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const focusInputRef = useRef<() => void>(() => {});

  const handleSetFocusCallback = useCallback((focusFn: () => void) => {
    focusInputRef.current = focusFn;
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const isAllCompleted = todos.length > 0 && activeTodosCount === 0;

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filter === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
        focusInputRef.current();
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleUpdateTodo = (todoId: number, data: Partial<Todo>) => {
    setUpdatingIds(prev => [...prev, todoId]);

    return updateTodo(todoId, data)
      .then(resTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === resTodo.id ? resTodo : todo)),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setUpdatingIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const idsToDelete = completedTodos.map(todo => todo.id);

    setDeletingIds(prev => [...prev, ...idsToDelete]);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(results => {
        const successfullyDeletedIds = idsToDelete.filter(
          (_, index) => results[index].status === 'fulfilled',
        );

        setTodos(prev =>
          prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
        );

        const hasErrors = results.some(result => result.status === 'rejected');

        if (hasErrors) {
          setErrorMessage('Unable to delete a todo');
        }

        focusInputRef.current();
      })
      .finally(() => {
        setDeletingIds([]);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isAllCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <NewTodo
            onAdd={handleAddTodo}
            setTempTodo={setTempTodo}
            setIsAdding={setIsAdding}
            isAdding={isAdding}
            setErrorMessage={setErrorMessage}
            setFocusCallback={handleSetFocusCallback}
          />
        </header>

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            updatingIds={updatingIds}
            tempTodo={tempTodo}
            todos={filteredTodos}
            isLoading={isLoading}
            deletingIds={deletingIds}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodosCount} items left`}
            </span>

            <Filter filter={filter} onFilterChange={setFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodos}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
