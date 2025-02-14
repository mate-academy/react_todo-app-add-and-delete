/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { TodoItem } from './components/TodoItem';

type SelectStatus = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectStatus, setSelectStatus] = useState<SelectStatus>('All');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [inputDisabled, setInpuDisabled] = useState(false);
  const visibleTodos = todos.filter(todo => {
    switch (selectStatus) {
      case 'Active':
        return !todo.completed;
      case 'Completed':
        return todo.completed;
      case 'All':
      default:
        return true;
    }
  });
  const completedTodosCount = todos.reduce((prev, todo) => {
    if (todo.completed) {
      return prev + 1;
    }

    return prev;
  }, 0);

  const handleError = (message: string) => {
    setErrorMessage(message);
    window.setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    titleInputRef.current?.focus();
  }, [titleInputRef, inputDisabled, todos]);

  useEffect(() => {
    getTodos()
      .then(result => {
        setTodos(result);
      })
      .catch(() => handleError('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSelectStatus = (
    e: React.MouseEvent<HTMLAnchorElement>,
    filterBy: SelectStatus,
  ) => {
    e.preventDefault();
    setSelectStatus(filterBy);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      handleError('Title should not be empty');

      return;
    }

    setInpuDisabled(true);

    setTempTodo({
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    });

    postTodo({ title: title.trim(), completed: false, userId: USER_ID })
      .then(result => {
        setTodos(prev => [...prev, result]);
        setTitle('');
      })
      .catch(() => handleError('Unable to add a todo'))
      .finally(() => {
        setInpuDisabled(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoToDelete: Todo) => {
    deleteTodo(todoToDelete.id)
      .then(() =>
        setTodos(current =>
          current.filter(todo => todo.id !== todoToDelete.id),
        ),
      )
      .catch(() => {
        handleError('Unable to delete a todo');
      });
  };

  const handleDeleteCompletedTodo = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const successfullyDeleted: Todo[] = [];

    const deleteTasks = completedTodos.map(todo => deleteTodo(todo.id));

    Promise.allSettled(deleteTasks).then(results => {
      results.forEach((result, index) => {
        if (result.status === 'rejected' && !errorMessage) {
          setErrorMessage('Unable to delete a todo');
        } else {
          successfullyDeleted.push(completedTodos[index]);
        }
      });
      setTodos(current =>
        current.filter(todo => !successfullyDeleted.includes(todo)),
      );
    });
  };

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
          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={inputDisabled}
              ref={titleInputRef}
              autoFocus
            />
          </form>
        </header>

        {loading && (
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', 'is-active')}
          >
            <div className="modal-background" />
            <div className="loader" />
          </div>
        )}

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              todo={todo}
              handleDeleteTodo={handleDeleteTodo}
              key={todo.id}
            />
          ))}
        </section>

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            handleDeleteTodo={handleDeleteTodo}
            loading={true}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.length - completedTodosCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: selectStatus === 'All',
                })}
                data-cy="FilterLinkAll"
                onClick={e => handleSelectStatus(e, 'All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: selectStatus === 'Active',
                })}
                data-cy="FilterLinkActive"
                onClick={e => handleSelectStatus(e, 'Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: selectStatus === 'Completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={e => handleSelectStatus(e, 'Completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleDeleteCompletedTodo}
              disabled={!completedTodosCount}
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
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
        {/*<br />*/}
        {/*Title should not be empty*/}
        {/*<br />*/}
        {/*Unable to add a todo*/}
        {/*<br />*/}
        {/*Unable to delete a todo*/}
        {/*<br />*/}
        {/*Unable to update a todo*/}
      </div>
    </div>
  );
};
