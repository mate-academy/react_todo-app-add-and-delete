/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';

const USER_ID = 11105;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [isSelected, setIsSelected] = useState('');
  const [isError, setIsError] = useState('');
  const [filtered, setFiltered] = useState<Todo[]>([]);
  const [disable, setDisable] = useState(false);

  const getAllTodo = async () => {
    try {
      setIsError('');
      const loadTodos = await todosService.getTodos(USER_ID);

      setTodos(loadTodos);

      if (filtered.length === 0
        && (isSelected !== 'Active'
          && isSelected !== 'Completed')) {
        setFiltered(todos);
      }
    } catch (error) {
      setIsError('Unable to update a todo');
    }
  };

  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTodo = {
      id: todos.length + 1,
      userId: USER_ID,
      title: newTitle.trim(),
      completed: false,
    };

    try {
      setIsError('');
      await todosService.createTodo(newTodo)
        .then(response => setFiltered(prevState => [...prevState, response]));

      // setFiltered(prevState => [...prevState, newTodo]);
    } catch (error) {
      setIsError('Unable to add a todo');
    }

    setDisable(false);
  };

  const removeTodo = (id: number) => {
    try {
      setIsError('');
      todosService.deleteTodo(id);
      setFiltered(prevState => prevState.filter(todo => todo.id !== id));
    } catch (error) {
      setIsError('Unable to delete a todo');
    }
  };

  const handleTodos = (value: string) => {
    switch (value) {
      case 'All':
        setFiltered(todos);
        break;
      case 'Active':
        setFiltered(todos.filter(todo => !todo.completed));
        break;
      case 'Completed':
        setFiltered(todos.filter(todo => todo.completed));
        break;
      case 'CompletedClear':
        todos.forEach(todo => {
          if (todo.completed) {
            removeTodo(todo.id);
          }
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getAllTodo();
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          {/* Add a todo on form submit */}
          <form onSubmit={(e) => {
            addTodo(e);
            setNewTitle('');
            setDisable(true);
          }}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              disabled={disable}
              onChange={e => setNewTitle(e.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main">
          { todos.length > 0 && (
            filtered.map(({
              title,
              id,
              completed,
              // userId,
            }) => {
              return (
                <div
                  className={classNames('todo',
                    { completed })}
                  key={id}
                >
                  <label className="todo__status-label">
                    <input
                      type="checkbox"
                      className="todo__status"
                      defaultChecked
                    />
                  </label>

                  <span className="todo__title">
                    {title}
                  </span>

                  {/* Remove button appears only on hover */}
                  <button
                    type="button"
                    className="todo__remove"
                    onClick={() => removeTodo(id)}
                  >
                    ×
                  </button>
                  {/* overlay will cover the todo while it is being updated */}
                  {/* overlay will cover the todo while it is being updated */}
                  <div className="modal overlay">
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              );
            }))}
        </section>

        {/* Hide the footer if there are no todos */}
        { todos && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              { todos.length }
              items left
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter">
              <a
                href="#/"
                className={classNames('filter__link',
                  { selected: isSelected === 'All' })}
                onClick={() => {
                  setIsSelected('All');
                  handleTodos('All');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link',
                  { selected: isSelected === 'Active' })}
                onClick={() => {
                  setIsSelected('Active');
                  handleTodos('Active');
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link',
                  { selected: isSelected === 'Completed' })}
                onClick={() => {
                  setIsSelected('Completed');
                  handleTodos('Completed');
                }}
              >
                Completed
              </a>
            </nav>

            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={() => handleTodos('CompletedClear')}
            >
              Clear completed
            </button>
          </footer>
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      { isError && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
            onClick={() => setIsError('')}
          />
          {isError}
        </div>
      )}
    </div>
  );
};
