/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID, createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo as TodoType } from './types/Todo';
import { Filter } from './components/Filter';
import { Todo } from './components/Todo';
import { TodoList } from './components/TodoList';
import { NewTodo, NewTodoHandle } from './components/NewTodo';

export const FILTERS = {
  all: 'all',
  completed: 'completed',
  active: 'active',
} as const;

type FilterType = (typeof FILTERS)[keyof typeof FILTERS];

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[] | null>(null);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [processings, setProcessings] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FILTERS.all);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newTodoRef = useRef<NewTodoHandle>(null);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        setTodos([]);
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isLoading = todos === null;
  const loadedTodos = todos || [];

  const visibleTodos = loadedTodos.filter(todo => {
    switch (filter) {
      case FILTERS.active:
        return !todo.completed;

      case FILTERS.completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const activeTodos = loadedTodos.filter(todo => !todo.completed);
  const completedTodos = loadedTodos.filter(todo => todo.completed);

  const showError = (message: string) => {
    setErrorMessage(message);
  };

  const addTodo = async (title: string): Promise<boolean> => {
    if (!title) {
      showError('Title should not be empty');

      return false;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const newTempTodo: TodoType = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const createdTodo = await createTodo(title);

      setTodos(currentTodos => {
        if (!currentTodos) {
          return [createdTodo];
        }

        return [...currentTodos, createdTodo];
      });

      setTempTodo(null);

      return true;
    } catch {
      setTempTodo(null);
      showError('Unable to add a todo');

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTodoById = (id: number) => {
    setErrorMessage('');
    setProcessings(current => [...current, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => {
          if (!currentTodos) {
            return currentTodos;
          }

          return currentTodos.filter(todo => todo.id !== id);
        });

        newTodoRef.current?.focus();
      })
      .catch(() => {
        showError('Unable to delete a todo');
        newTodoRef.current?.focus();
      })
      .finally(() => {
        setProcessings(current => current.filter(todoId => todoId !== id));
      });
  };

  const clearCompleted = () => {
    setErrorMessage('');

    const completedIds = completedTodos.map(todo => todo.id);

    setProcessings(current => [...current, ...completedIds]);

    Promise.allSettled(
      completedIds.map(id => deleteTodo(id).then(() => id)),
    ).then(results => {
      const successfulIds = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      const hasError = results.some(result => result.status === 'rejected');

      if (successfulIds.length > 0) {
        setTodos(currentTodos => {
          if (!currentTodos) {
            return currentTodos;
          }

          return currentTodos.filter(todo => !successfulIds.includes(todo.id));
        });
      }

      if (hasError) {
        showError('Unable to delete a todo');
      }

      setProcessings(current =>
        current.filter(id => !completedIds.includes(id)),
      );

      newTodoRef.current?.focus();
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {loadedTodos.length > 0 ? (
          <header className="todoapp__header">
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: activeTodos.length === 0,
              })}
              data-cy="ToggleAllButton"
            />

            <NewTodo
              ref={newTodoRef}
              onAdd={addTodo}
              isSubmitting={isSubmitting}
            />
          </header>
        ) : (
          <NewTodo
            ref={newTodoRef}
            onAdd={addTodo}
            isSubmitting={isSubmitting}
          />
        )}

        {isLoading && (
          <section className="todoapp__main" data-cy="TodoList">
            <div className="todo">
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </section>
        )}

        {!isLoading && loadedTodos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            processings={processings}
            onDelete={deleteTodoById}
          />
        )}

        {!isLoading && tempTodo && (
          <section className="todoapp__main">
            <Todo todo={tempTodo} isLoading onDelete={() => {}} />
          </section>
        )}

        {!isLoading && loadedTodos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>

            <Filter filter={filter} setFilter={setFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodos.length === 0}
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};
