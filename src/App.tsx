/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';

type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');

  const [filter, setFilter] = useState<FilterStatus>('all');

  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTodos = todos.filter(todo => !todo.completed).length;

  const [editingId, setEditingId] = useState<number | null>(null);

  const [editedTitle, setEditedTitle] = useState('');

  const editInputRef = useRef<HTMLInputElement>(null);

  const [isCancelling, setIsCancelling] = useState(false);

  const loadTodos = async () => {
    try {
      setError('');

      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch {
      setError('Unable to load todos');
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, tempTodo, error]);

  useEffect(() => {
    if (editingId !== null) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [editingId]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return true;
    }
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    setError('');

    const todoToSend = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    const temp = {
      id: 0,
      ...todoToSend,
    };

    setTempTodo(temp);

    try {
      const createdTodo = await addTodo(todoToSend);

      setTodos(current => [...current, createdTodo]);
      setNewTitle('');

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      // inputRef.current?.focus();
    } catch {
      setError('Unable to add a todo');
      setNewTitle(trimmedTitle);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } finally {
      setTempTodo(null);
      setLoadingIds(ids => ids.filter(id => id !== temp.id));

      // inputRef.current?.focus();
    }
  };

  const handleDelete = async (todoId: number) => {
    setError('');

    setLoadingIds(ids => [...ids, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(current => {
        const updated = current.filter(todo => todo.id !== todoId);

        return updated;
      });
      inputRef.current?.focus();
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingIds(ids => ids.filter(id => id !== todoId));
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const handleClearCompleted = async () => {
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingIds(ids => [...ids, ...completedIds]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successIds = completedTodos
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);

    const hasErrors = results.some(result => result.status === 'rejected');

    if (hasErrors) {
      setError('Unable to delete a todo');
    }

    setTodos(current => current.filter(todo => !successIds.includes(todo.id)));

    setLoadingIds(ids => ids.filter(id => !completedIds.includes(id)));
  };

  const handleToggle = async (todo: Todo) => {
    setError('');

    setLoadingIds(ids => [...ids, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(current =>
        current.map(item => (item.id === todo.id ? updatedTodo : item)),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = async () => {
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    const ids = todosToUpdate.map(todo => todo.id);

    setLoadingIds(current => [...current, ...ids]);

    const results = await Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, {
          completed: newStatus,
        }),
      ),
    );

    const updatedTodos = [...todos];

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const updated = result.value;

        const todoIndex = updatedTodos.findIndex(
          todo => todo.id === updated.id,
        );

        updatedTodos[todoIndex] = updated;
      }
    });

    if (results.some(result => result.status === 'rejected')) {
      setError('Unable to update a todo');
    }

    setTodos(updatedTodos);

    setLoadingIds(current => current.filter(id => !ids.includes(id)));
  };

  const handleRename = async (todo: Todo) => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingId(null);

      return;
    }

    if (!trimmedTitle) {
      await handleDelete(todo.id);

      return;
    }

    setLoadingIds(ids => [...ids, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        title: trimmedTitle,
      });

      setTodos(current =>
        current.map(item => (item.id === todo.id ? updatedTodo : item)),
      );

      setEditingId(null);
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  return (
    <section className="section container">
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            {/* this button should have `active` class only if all todos are completed */}
            <button
              type="button"
              className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
              disabled={loadingIds.length > 0}
            />

            {/* Add a todo on form submit */}
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                data-cy="NewTodoField"
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={newTitle}
                disabled={tempTodo !== null}
                onChange={event => setNewTitle(event.target.value)}
                autoFocus
              />
            </form>
          </header>

          {(todos.length > 0 || tempTodo) && (
            <section className="todoapp__main" data-cy="TodoList">
              <TransitionGroup>
                <div>
                  {visibleTodos.map(todo => (
                    <CSSTransition
                      key={todo.id}
                      in={true}
                      timeout={300}
                      classNames="item"
                      unmountOnExit
                    >
                      <div
                        key={todo.id}
                        data-cy="Todo"
                        className={`todo ${todo.completed ? 'completed' : ''}`}
                      >
                        <label className="todo__status-label">
                          <input
                            aria-label="Todo status"
                            data-cy="TodoStatus"
                            type="checkbox"
                            className="todo__status"
                            checked={todo.completed}
                            // readOnly
                            onChange={() => handleToggle(todo)}
                            disabled={loadingIds.includes(todo.id)}
                          />
                        </label>
                        {editingId === todo.id ? (
                          <form
                            onSubmit={async event => {
                              event.preventDefault();

                              await handleRename(todo);
                            }}
                          >
                            <input
                              ref={editInputRef}
                              data-cy="TodoTitleField"
                              type="text"
                              className="todo__title-field"
                              placeholder="Empty todo will be deleted"
                              value={editedTitle}
                              // autoFocus
                              onChange={e => setEditedTitle(e.target.value)}
                              onBlur={() => {
                                if (isCancelling) {
                                  setIsCancelling(false);

                                  return;
                                }

                                handleRename(todo);
                              }}
                              onKeyUp={event => {
                                if (event.key === 'Escape') {
                                  setIsCancelling(true);
                                  setEditingId(null);
                                }
                              }}
                            />
                          </form>
                        ) : (
                          <>
                            <span
                              data-cy="TodoTitle"
                              className="todo__title"
                              onDoubleClick={() => {
                                setEditingId(todo.id);
                                setEditedTitle(todo.title);
                              }}
                            >
                              {todo.title}
                            </span>

                            <button
                              type="button"
                              className="todo__remove"
                              data-cy="TodoDelete"
                              onClick={() => handleDelete(todo.id)}
                            >
                              ×
                            </button>
                          </>
                        )}

                        <div
                          data-cy="TodoLoader"
                          className={`modal overlay ${
                            loadingIds.includes(todo.id) ? 'is-active' : ''
                          }`}
                        >
                          <div className="modal-background has-background-white-ter" />
                          <div className="loader" />
                        </div>
                      </div>
                    </CSSTransition>
                  ))}

                  {tempTodo && (
                    <div data-cy="Todo" className="todo">
                      <label className="todo__status-label">
                        <input
                          aria-label="Todo status"
                          type="checkbox"
                          className="todo__status"
                          disabled
                        />
                      </label>

                      <span data-cy="TodoTitle" className="todo__title">
                        {tempTodo.title}
                      </span>

                      <button type="button" className="todo__remove" disabled>
                        ×
                      </button>

                      <div
                        data-cy="TodoLoader"
                        className="modal overlay is-active"
                      >
                        <div className="modal-background has-background-white-ter" />
                        <div className="loader" />
                      </div>
                    </div>
                  )}
                </div>
              </TransitionGroup>
            </section>
          )}

          {/* Hide the footer if there are no todos */}
          {(todos.length > 0 || tempTodo) && (
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodos} items left
              </span>

              {/* Active link should have the 'selected' class */}
              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                  onClick={() => setFilter('all')}
                  data-cy="FilterLinkAll"
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                  onClick={() => setFilter('active')}
                  data-cy="FilterLinkActive"
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                  onClick={() => setFilter('completed')}
                  data-cy="FilterLinkCompleted"
                >
                  Completed
                </a>
              </nav>

              {/* this button should be disabled if there are no completed todos */}
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={completedTodos.length === 0}
                onClick={handleClearCompleted}
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
          className={`
              notification is-danger is-light has-text-weight-normal
              ${!error ? 'hidden' : ''}
            `}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setError('')}
          />
          {/* show only one message at a time */}
          {error}
        </div>
      </div>
    </section>
  );
};
