/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { UserWarning } from './utils/UserWarning';
import { Todo } from './types/Todo';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { TodoItem } from './components/TodoItem';

enum Filter {
  All = 'FilterLinkAll',
  Active = 'FilterLinkActive',
  Completed = 'FilterLinkCompleted',
}

const USER_ID = 11408;

const filterTodos = (todos: Todo[], filter: Filter) => {
  return todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      case Filter.All:
      default: return true;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<Array<number>>([]);
  const focusRef = useRef<HTMLInputElement>(null);
  const errorTimerId = useRef(0);
  const todosCounter = todos.length - todos
    .reduce((acc, todo) => acc + +todo.completed, 0);

  focusRef.current?.focus();

  const handleErrorMessage = () => {
    if (errorTimerId.current) {
      clearTimeout(errorTimerId.current);
    }

    errorTimerId.current = window.setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleInputSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      return setErrorMessage('Title should not be empty');
    }

    if (focusRef.current) {
      focusRef.current.disabled = true;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then(todoData => {
        setTodos(currentTodos => [...currentTodos, todoData]);
        setQuery('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        if (focusRef.current) {
          focusRef.current.disabled = false;
          focusRef.current.focus();
        }
      });

    return true;
  };

  const handleTodoDelete = async (id: number) => {
    setProcessingTodoIds(prev => [...prev, id]);
    try {
      const deletedTodo = await deleteTodo(id);

      if (deletedTodo) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      } else {
        setErrorMessage('Unable to delete a todo');
      }
    } catch {
      setErrorMessage('Unable to delete a todo');
    }
  };

  useEffect(() => {
    handleErrorMessage();
  }, [errorMessage]);

  useEffect(() => {
    if (USER_ID) {
      getTodos(USER_ID)
        .then((todosData) => setTodos(filterTodos(todosData, filter)))
        .catch(() => setErrorMessage('Unable to load todos'))
        .finally(() => {
          focusRef.current?.focus();
        });
    }
  }, [filter, todos.length]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}
          {/* Add a todo on form submit */}
          <form onSubmit={handleInputSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              onFocus={() => true}
              value={query}
              onChange={event => setQuery(event.target.value)}
              ref={focusRef}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              handleTodoDelete={() => handleTodoDelete(todo.id)}
              isLoading={processingTodoIds.includes(todo.id)}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              isLoading
            />
          )}
        </section>

        {/* Hide the footer if there are no todos */}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todosCounter} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter" data-cy="Filter">
              {Object.keys(Filter).map((filterKey) => {
                const filterKeyType = Filter[filterKey as keyof typeof Filter];

                return (
                  <a
                    href="#/"
                    className={cn({
                      selected: filter === filterKeyType,
                    }, 'filter__link')}
                    data-cy={filterKeyType}
                    onClick={() => setFilter(filterKeyType)}
                    key={filterKey}
                  >
                    {filterKey}
                  </a>
                );
              })}
            </nav>

            {/* don't show this button if there are no completed todos */}
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

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn({
          hidden: !errorMessage,
        }, 'notification is-danger is-light has-text-weight-normal')}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
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
      </div>
    </div>
  );
};
