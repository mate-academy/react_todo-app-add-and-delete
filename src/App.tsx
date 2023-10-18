/* eslint-disable jsx-a11y/control-has-associated-label */
import classnames from 'classnames';
import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import {
  AppContext,
  AppContextType,
  USER_ID,
} from './Contexts/AppContextProvider';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const {
    query,
    setQuery,
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    visibleTodos,
    setQueryCondition,
    queryCondition,
    isFetching,
    setIsFetching,
    inputRef,
  } = useContext(AppContext) as AppContextType;

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const activeItems = todos.filter((todo) => !todo.completed).length;

  const postTodo = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!query.trim()) {
        setErrorMessage('Title should not be empty');

        return;
      }

      const newTodo: Omit<Todo, 'id'> = {
        title: query.trim(),
        completed: false,
        userId: USER_ID,
      };

      try {
        setIsFetching(true);
        setTempTodo({ ...newTodo, id: 0 });

        const response = await client.post<Todo>('/todos', newTodo);

        setTodos((prev) => {
          return [...prev, response];
        });

        setQuery('');
      } catch (error) {
        setErrorMessage('Unable to add a todo');
        setTodos(todos);
      } finally {
        setTempTodo(null);
        setIsFetching(false);
      }
    },
    [query, setErrorMessage, setIsFetching, setQuery, setTodos, todos],
  );

  const toggleAll = useCallback(
    (condition: boolean = todos.some((todo) => !todo.completed)) => {
      setIsFetching(true);

      const updatedTodos: Todo[] = todos
        .filter((todo) => todo.completed === !condition)
        .map((todo) => {
          return {
            ...todo,
            completed: condition,
          };
        });

      updatedTodos.map(async (toggledTodo) => {
        setTodos((prev) => {
          const untoggledTodos = prev.filter(
            (todo) => todo.completed === condition,
          );

          return [...untoggledTodos, toggledTodo].sort((a, b) => a.id - b.id);
        });

        try {
          await client.patch<Todo>(`/todos/${toggledTodo.id}`, toggledTodo);
        } catch (error) {
          setTodos((prev) => {
            const restTodos = prev.filter((todo) => todo.id !== toggledTodo.id);

            const failedTodo: Todo = {
              ...toggledTodo,
              completed: !toggledTodo.completed,
            };

            return [...restTodos, failedTodo].sort((a, b) => a.id - b.id);
          });
          setErrorMessage('Unable to update a todo');
        }
      });

      setIsFetching(false);
    },
    [setErrorMessage, setIsFetching, setTodos, todos],
  );

  const deleteAllCompleted = useCallback(() => {
    const itemsToDelete: Todo[] = todos.filter((todo) => todo.completed);

    setIsFetching(true);

    itemsToDelete.map(async (todoToDel) => {
      setTodos((prev) => [...prev.filter((todo) => todo.id !== todoToDel.id)]);

      try {
        await client.delete(`/todos/${todoToDel.id}`);
      } catch {
        setTodos((prev) => [...prev, todoToDel].sort((a, b) => a.id - b.id));
        setErrorMessage('Unable to delete a todo');
      }
    });

    setIsFetching(false);
  }, [setErrorMessage, setIsFetching, setTodos, todos]);

  useEffect(() => {
    if (errorMessage !== 'Unable to update a todo' && errorMessage) {
      inputRef.current?.focus();
    }
  }, [inputRef, todos, errorMessage]);

  useEffect(() => {
    if (errorMessage) {
      window.setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage, setErrorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={classnames('todoapp__toggle-all', {
                active: !todos.some((todo) => todo.completed === false),
              })}
              data-cy="ToggleAllButton"
              onClick={() => toggleAll()}
            />
          )}

          <form onSubmit={(e) => postTodo(e)}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isFetching}
            />
          </form>
        </header>

        {!!todos.length && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map((todo) => (
                <TodoItem todo={todo} key={todo.id} />
              ))}
              {tempTodo && <TodoItem todo={tempTodo} tempIsLoading />}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${activeItems} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={classnames('filter__link', {
                    selected: queryCondition === 'all',
                  })}
                  data-cy="FilterLinkAll"
                  onClick={() => setQueryCondition('all')}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classnames('filter__link', {
                    selected: queryCondition === 'active',
                  })}
                  data-cy="FilterLinkActive"
                  onClick={() => setQueryCondition('active')}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classnames('filter__link', {
                    selected: queryCondition === 'completed',
                  })}
                  data-cy="FilterLinkCompleted"
                  onClick={() => setQueryCondition('completed')}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={activeItems === todos.length}
                onClick={deleteAllCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classnames(
          'notification is-danger is-light has-text-weight-normal',
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
