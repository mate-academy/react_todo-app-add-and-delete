/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { TodoContext } from './todoContext';
import { TodoList } from './todoList';

const USER_ID = 22;

export const App: React.FC = () => {
  // #region UseStates
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [count, setCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // #endregion

  let errorTimerId: NodeJS.Timeout;

  const errorHandler = (errorPlace: string) => {
    clearTimeout(errorTimerId);

    switch (errorPlace) {
      case 'title':
        setErrorMessage('Title should not be empty');
        break;
      case 'add':
        setErrorMessage('Unable to add a todo');
        break;
      case 'update':
        setErrorMessage('Unable to update a todo');
        break;
      case 'delete':
        setErrorMessage('Unable to delete a todo');
        break;
      default:
    }

    errorTimerId = setTimeout(() => {
      setError(false);
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => {
        setTodos(data);
        setCount(data.length);
      })
      .catch(e => {
        setError(true);
        errorHandler('add');
        throw e;
      });
  }, []);

  // #region Handlers

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const filteredTodo = todos.filter(todo => {
    if (selectedFilter === 'Completed') {
      return todo.completed;
    }

    if (selectedFilter === 'Active') {
      return !todo.completed;
    }

    return true;
  });

  const handleErrorButton = () => {
    setError(false);
    errorHandler('title');
  };

  const handleFilter = (query: string) => {
    setSelectedFilter(query);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimedTitle = title.trim();

    if (!trimedTitle.length) {
      setError(true);
      errorHandler('title');
    }

    const addTodo = (newTodo: Todo) => {
      setTodos([...todos, newTodo]);
    };

    if (trimedTitle.length) {
      setCount(count + 1);
      const id = (+new Date());

      const newTodo: Todo = {
        id,
        title,
        completed: false,
        userId: USER_ID,
      };

      addTodo(newTodo);
      setTitle('');
    }

    return setTitle('');
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    if (areAllCompleted) {
      setCount(todos.length);
    } else {
      setCount(0);
    }

    setTodos(updatedTodos);
  };

  const handleClear = () => {
    const updatingTodos = todos.filter(todo => !todo.completed);

    setTodos(updatingTodos);
    setCount(updatingTodos.length);
  };

  // #endregion

  const deleteTodo = (deleteId: number) => {
    const todoForDeletion = todos.filter(todo => todo.id === deleteId);

    if (todoForDeletion[0].completed) {
      return setTodos(todos.filter(todo => todo.id !== deleteId));
    }

    setCount(count - 1);

    return setTodos(todos.filter(todo => todo.id !== deleteId));
  };

  const checkForCompleted = todos.filter(todo => todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  const value = {
    filteredTodo,
    deleteTodo,
    setCount,
    count,
    setTodos,
    todos,
  };

  return (
    <div className="todoapp">
      <TodoContext.Provider value={value}>
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            {/* this buttons is active only if there are some active todos */}
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />

            <form onSubmit={handleSubmit}>
              <input
                data-cy="NewTodoField"
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                onChange={handleInput}
              />
            </form>
          </header>

          <section className="todoapp__main" data-cy="TodoList">
            <TodoList />
          </section>

          {/* Hide the footer if there are no todos */}
          {todos.length > 0 && (
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {count === 1 ? `${count} item left`
                  : `${count} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: selectedFilter === 'All',
                  })}
                  onClick={() => {
                    handleFilter('All');
                  }}
                  data-cy="FilterLinkAll"
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: selectedFilter === 'Active',
                  })}
                  onClick={() => {
                    handleFilter('Active');
                  }}
                  data-cy="FilterLinkActive"
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: selectedFilter === 'Completed',
                  })}
                  onClick={() => {
                    handleFilter('Completed');
                  }}
                  data-cy="FilterLinkCompleted"
                >
                  Completed
                </a>
              </nav>

              {/* don't show this button if there are no completed todos */}
              {checkForCompleted > 0 && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  onClick={handleClear}
                >
                  Clear completed
                </button>
              )}
            </footer>
          )}
        </div>

        {/* Notification is shown in case of any error */}
        {/* Add the 'hidden' class to hide the message smoothly */}
        <div
          data-cy="ErrorNotification"
          className={classNames(
            'notification is-danger is-light has-text-weight-normal', {
              hidden: error === false,
            },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={handleErrorButton}
          />
          {errorMessage}
        </div>
      </TodoContext.Provider>
    </div>
  );
};
