/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoContext } from './todoContext';
import { TodoList } from './todoList';

const USER_ID = 22;

export const App: React.FC = () => {
  // #region UseStates
  const [todos, setTodos] = useState<Todo[]>([]);
  const [titleValue, setTitleValue] = useState('');
  const [count, setCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmiting] = useState(false);
  const [isDeliting, setIsDeliting] = useState(false);
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
    todoService.getTodos(USER_ID)
      .then(data => {
        setTodos(data);
        setCount(data.length);
      })
      .catch(e => {
        setError(true);
        errorHandler('add');
        throw e;
      });
    // eslint-disable-next-line
  }, []);

  // #region Handlers

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(event.target.value);
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
    const trimedTitle = titleValue.trim();

    if (!trimedTitle.length) {
      setError(true);
      errorHandler('title');
      setTitleValue('');
    }

    const addTodo = ({ userId, title, completed }: Todo) => {
      return todoService.addTodo({ userId, title, completed })
        .then(newTodo => {
          setTodos([...todos, newTodo]);
          setCount(count + 1);
        })
        .catch(e => {
          setError(true);
          errorHandler('add');
          throw e;
        });
    };

    if (trimedTitle.length) {
      const id = (+new Date());

      const newTodo: Todo = {
        id,
        title: titleValue,
        completed: false,
        userId: USER_ID,
      };

      setIsSubmiting(true);
      addTodo(newTodo)
        .finally(() => {
          setIsSubmiting(false);
        });
      setTitleValue('');
    }

    return setTitleValue('');
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

  const deleteTodo = (deleteId: number) => {
    setIsDeliting(true);
    const todoForDeletion = todos.filter(todo => todo.id === deleteId);

    if (todoForDeletion[0].completed) {
      setTodos(todos.filter(todo => todo.id !== deleteId));
    } else {
      setCount(count - 1);

      setTodos(todos.filter(todo => todo.id !== deleteId));
    }

    return todoService.deleteTodo(deleteId)
      .catch(e => {
        setError(true);
        setTodos(todos);
        setCount(count);
        errorHandler('delete');
        throw e;
      })
      .finally(() => {
        setIsDeliting(false);
      });
  };

  const handleClear = () => {
    const deletingTodos = todos.filter(todo => !todo.completed);

    todos.map(todo => {
      if (todo.completed) {
        return deleteTodo(todo.id);
      }

      return todo;
    });

    setTodos(deletingTodos);
    setCount(deletingTodos.length);
  };

  // #endregion

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
    isSubmitting,
    setIsSubmiting,
    isDeliting,
    setIsDeliting,
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
                disabled={isSubmitting}
                // eslint-disable-next-line
                autoFocus
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
