/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Filters, Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoItem } from './compontents/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filters>(Filters.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [waitingDeleteTodos, setWaitingDeleteTodos] = useState<number[]>([]);
  const [keyToForm, setKeyToForm] = useState(0);
  const [formDisabled, setFormDisabled] = useState(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleDeleteTodo = (id: number) => {
    setWaitingDeleteTodos(current => [...current, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setWaitingDeleteTodos(current => current.filter(item => item !== id));
        setKeyToForm(current => current + 1);
      });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = newTitle.trim();

    if (!normalizedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: 0,
    });

    setFormDisabled(true);

    createTodo(normalizedTitle)
      .then(todo => {
        setTodos(current => [...current, todo]);
        setNewTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setKeyToForm(current => current + 1);
        setFormDisabled(false);
      });
  };

  const handleMassiveDelete = () => {
    for (const todo of todos) {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    }
  };

  function getFilteredTodos(allTodos: Todo[]) {
    let filteredTodos = [...allTodos];

    filteredTodos = filteredTodos.filter(todo => {
      switch (filterBy) {
        case Filters.active:
          return todo.completed === false;
        case Filters.completed:
          return todo.completed === true;
        default:
          return true;
      }
    });

    return filteredTodos;
  }

  function getActiveTodos(allTodos: Todo[]) {
    return allTodos.filter(todo => !todo.completed);
  }

  const filteredTodos = getFilteredTodos(todos);

  const activeTodos = getActiveTodos(todos);
  const isAllCompleted = activeTodos.length === 0;
  const completedTodos = todos.length - activeTodos.length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: isAllCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit} key={keyToForm}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              autoFocus
              disabled={formDisabled}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {filteredTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={0} classNames="item">
                <TodoItem
                  todo={todo}
                  onDelete={handleDeleteTodo}
                  loader={waitingDeleteTodos.includes(todo.id)}
                />
              </CSSTransition>
            ))}
            {tempTodo && (
              <CSSTransition
                key={tempTodo.id}
                timeout={0}
                classNames="temp-item"
              >
                <TodoItem todo={tempTodo} loader={true} onDelete={() => {}} />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterBy === Filters.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterBy(Filters.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterBy === Filters.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterBy(Filters.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterBy === Filters.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterBy(Filters.completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleMassiveDelete}
              disabled={completedTodos < 1}
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
        {/* show only one message at a time */}
        {errorMessage}
        {/* <br />
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
