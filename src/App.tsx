/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { TodoRow } from './components/TodoRow';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.all);

  const inputRef = useRef<HTMLInputElement>(null);

  function showErrorMessage(errorMessage: string) {
    setErrorMessages(currentErorrMessages => [
      ...currentErorrMessages,
      errorMessage,
    ]);

    setTimeout(() => {
      setErrorMessages(currentErorrMessages =>
        currentErorrMessages.filter(
          currentMessage => currentMessage !== errorMessage,
        ),
      );
    }, 3000);
  }

  useEffect(() => {
    setErrorMessages([]);
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        showErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading]);

  const visibleTodos = useMemo(() => {
    return todos.filter(currentTodo => {
      if (filter === FilterStatus.active) {
        return !currentTodo.completed;
      }

      if (filter === FilterStatus.completed) {
        return currentTodo.completed;
      }

      return true;
    });
  }, [filter, todos]);

  const activeTodosCount = useMemo(() => {
    return todos.filter(currentTodo => currentTodo.completed === false).length;
  }, [todos]);

  const completedTodosCount = useMemo(() => {
    return todos.filter(currentTodo => currentTodo.completed === true).length;
  }, [todos]);

  function handleOnSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedTitle = newTodoTitle.trim();

    setIsLoading(true);
    if (!normalizedTitle) {
      showErrorMessage('Title should not be empty');
      setIsLoading(false);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    };

    setTempTodo(newTodo);
    setErrorMessages([]);

    addTodo(newTodo)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        showErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  }

  function handleOnDelete(todoId: number) {
    setProcessingIds(currentProcessingIds => [...currentProcessingIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(currentTodo => currentTodo.id !== todoId),
        );
      })
      .catch(() => {
        showErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingIds(currentProcessingIds =>
          currentProcessingIds.filter(currentId => currentId !== todoId),
        );
        inputRef.current?.focus();
      });
  }

  function handleClearCompleted() {
    const completedTodos = todos.filter(
      currentTodo => currentTodo.completed === true,
    );

    completedTodos.forEach(deletingTodo => {
      setProcessingIds(currentProcessingIds => [
        ...currentProcessingIds,
        deletingTodo.id,
      ]);

      deleteTodo(deletingTodo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(
              currentTodo => currentTodo.id !== deletingTodo.id,
            ),
          );
        })
        .catch(() => {
          showErrorMessage('Unable to delete a todo');
        })
        .finally(() => {
          setProcessingIds(currentProcessingIds =>
            currentProcessingIds.filter(
              currentId => currentId !== deletingTodo.id,
            ),
          );
          inputRef.current?.focus();
        });
    });
  }

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

          {/* Add a todo on form submit */}
          <form onSubmit={handleOnSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              disabled={isLoading}
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(currentTodo => (
            <TodoRow
              key={currentTodo.id}
              todo={currentTodo}
              isProcessing={processingIds.includes(currentTodo.id)}
              onDelete={() => handleOnDelete(currentTodo.id)}
            />
          ))}

          {tempTodo && (
            <div
              data-cy="Todo"
              key={tempTodo.id}
              className={cn('todo', { completed: tempTodo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: filter === FilterStatus.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(FilterStatus.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filter === FilterStatus.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(FilterStatus.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filter === FilterStatus.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(FilterStatus.completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodosCount === 0}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: errorMessages.length === 0 },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessages([])}
        />
        {/* show only one message at a time */}
        {errorMessages.map((msg, index) => (
          <div key={index}>
            {msg}
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};
