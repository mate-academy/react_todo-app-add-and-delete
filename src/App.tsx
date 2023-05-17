/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos, addTodo, removeTodo } from './api/todos';

const USER_ID = 10404;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [isRemoved, setIsRemoved] = useState(false);

  const activeTodos = todos.filter((todo) => !todo.completed);
  const comletedTodos = todos.filter((todo) => todo.completed);

  const fetchTodos = async () => {
    const newTodos = await getTodos(USER_ID);

    setTodos(newTodos);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const sortedTodos = todos.filter(todo => {
    switch (filter) {
      case 'Active':
        return !todo.completed;
      case 'Completed':
        return todo.completed;
      default:
        return todos;
    }
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title can not be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);

    if (tempTodo) {
      addTodo(tempTodo)
        .then((response) => {
          if (response instanceof Error) {
            setError(response.message);

            return;
          }

          setTodos([...todos, response]);
          setTitle('');
        })
        .catch(() => setError('Unable to add todo'))
        .finally(() => {
          setTempTodo(null);
        });
    }
  };

  const handleRemove = (id: number) => {
    setIsRemoved(true);

    removeTodo(id)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setIsRemoved(false));
  };

  const removeCompleted = () => {
    const completedIds = comletedTodos.map((todo) => todo.id);

    completedIds.forEach((id) => {
      setIsRemoved(true);

      removeTodo(id)
        .then(() => {
          setTodos(todos.filter((todo) => todo.id !== id));
        })
        .catch(() => setError('Unable to delete a todo'))
        .finally(() => setIsRemoved(false));
    });
  };

  getTodos(USER_ID).then((response) => setTodos(response));

  const visibleTodos = sortedTodos;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {todos.length > 0 && (
            <button type="button" className="todoapp__toggle-all active" />
          )}
          {/* Add a todo on form submit */}
          <form onSubmit={submit}>
            <input
              type="text"
              value={title}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {visibleTodos.map(todo => (
            <div
              className={cn(
                'todo',
                { completed: todo.completed },
              )}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span className="todo__title">{todo.title}</span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                onClick={() => {
                  handleRemove(todo.id);
                }}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being updated */}
              <div className={cn('modal overlay',
                { 'is-active': isRemoved })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter">
              <a
                href="#/"
                className={cn('filter__link',
                  { selected: filter === 'All' })}
                onClick={() => setFilter('All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link',
                  { selected: filter === 'Active' })}
                onClick={() => setFilter('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link',
                  { selected: filter === 'Complited' })}
                onClick={() => setFilter('Completed')}
              >
                Completed
              </a>
            </nav>

            {/* don't show this button if there are no completed todos */}
            {comletedTodos.length > 0 && (
                <button
                type="button"
                className="todoapp__clear-completed"
                onClick={removeCompleted}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {error && (
        <div
          className="notification is-danger is-light has-text-weight-normal"
          // eslint-disable-line
        >
          <button
            type="button"
            className="delete"
            onClick={() => setError(null)}
          />

          {/* show only one message at a time */}
          {error}
        </div>
      )}
    </div>
  );
};
