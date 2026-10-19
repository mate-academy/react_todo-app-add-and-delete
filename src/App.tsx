/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, addTodos, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newTodo, setNewTodo] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [addingTodo, setAddingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    if (!addingTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [addingTodo]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(new Error('Unable to load todos'));
      });
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(timerId);
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);

    setTodos(todos.map(todo => ({ ...todo, completed: !allCompleted })));
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setDeletingIds(ids => [...ids, ...completedTodos.map(todo => todo.id)]);

    Promise.all(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => ({ id: todo.id, success: true }))
          .catch(() => ({ id: todo.id, success: false })),
      ),
    )
      .then(results => {
        const deletedIds = results
          .filter(result => result.success)
          .map(result => result.id);

        if (results.some(result => !result.success)) {
          setError(new Error('Unable to delete a todo'));
        }

        setTodos(current =>
          current.filter(todo => !deletedIds.includes(todo.id)),
        );
      })
      .finally(() => {
        const completedIds = completedTodos.map(todo => todo.id);

        setDeletingIds(ids => ids.filter(id => !completedIds.includes(id)));
        inputRef.current?.focus();
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
            className={`todoapp__toggle-all ${todos.length > 0 && todos.every(todo => todo.completed) ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={handleToggleAll}
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={e => {
              e.preventDefault();
              if (newTodo.trim() === '') {
                setError(new Error('Title should not be empty'));

                return;
              }

              setAddingTodo(true);
              setTempTodo({
                id: 0,
                title: newTodo.trim(),
                userId: USER_ID,
                completed: false,
              });

              addTodos({
                title: newTodo.trim(),
                userId: USER_ID,
                completed: false,
              })
                .then((createdTodo: Todo) => {
                  setTodos(current => [...current, createdTodo]);
                  setNewTodo('');
                })
                .catch(() => {
                  setError(new Error('Unable to add a todo'));
                })
                .finally(() => {
                  setTempTodo(null);
                  setAddingTodo(false);
                  inputRef.current?.focus();
                });
            }}
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              disabled={addingTodo}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  setDeletingIds(ids => [...ids, todo.id]);
                  deleteTodo(todo.id)
                    .then(() =>
                      setTodos(current =>
                        current.filter(t => t.id !== todo.id),
                      ),
                    )
                    .catch(() => setError(new Error('Unable to delete a todo')))
                    .finally(() => {
                      setDeletingIds(ids => ids.filter(id => id !== todo.id));
                      inputRef.current?.focus();
                    });
                }}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={`modal overlay ${deletingIds.includes(todo.id) ? 'is-active' : ''}`}
              >
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
                  checked={false}
                  readOnly
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

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => {
                  setFilter('all');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={todos.filter(todo => todo.completed).length === 0}
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
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error && <span>{error.message}</span>}
        {/*Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo*/}
      </div>
    </div>
  );
};
