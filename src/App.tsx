/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

type FilterType = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [addingTodo, setAddingTodo] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const getAllTodos = async () => {
    try {
      const allTodos = await getTodos();

      setTodos(allTodos);
    } catch {
      setErrorMessage('Unable to load todos');
      setTimeout(() => {
        setErrorMessage('');
      }, 3_000);
    }
  };

  const addNewTodo = async () => {
    setAddingTodo(true);
    setTempTodo({
      id: 0,
      completed: false,
      title,
      userId: USER_ID,
    });
    try {
      const newTodo = await addTodo({
        userId: USER_ID,
        completed: false,
        title: title.trim(),
      });

      if (newTodo) {
        setTodos([...todos, newTodo]);
        setTitle('');
      }
    } catch {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3_000);
    } finally {
      setAddingTodo(false);
      setTempTodo(null);
    }
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  useEffect(() => {
    if (!addingTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [addingTodo]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3_000);

      return;
    }

    addNewTodo();
  };

  const filterTodos = (type: FilterType) => {
    switch (type) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filter = filterTodos(filterType);

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
          <form onSubmit={onSubmit}>
            <input
              autoFocus
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              value={title}
              disabled={addingTodo}
              onChange={e => setTitle(e.target.value)}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filter.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={todo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
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
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* 'is-active' class puts this modal on top of the todo */}
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${itemsLeft} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterType === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterType('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterType === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterType('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterType === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterType('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            {todos.filter(todo => todo.completed).length && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          `notification is-danger is-light
has-text-weight-normal`,
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
