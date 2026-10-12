/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, getTodos, USER_ID, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Filter } from './types/Filter';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>('all');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function searchTodos() {
      try {
        setErrorMessage('');
        const receivedTodos = await getTodos();

        setTodos(receivedTodos);
      } catch (error) {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    }

    searchTodos();
  }, []);

  useEffect(() => {
    if (tempTodo === null) {
      newTodoField.current?.focus();
    }
  }, [tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredActiveTodos = todos.filter(todo => todo.completed !== true);
  const filteredCompletedTodos = todos.filter(todo => todo.completed === true);
  let visibleTodos;

  switch (selectedFilter) {
    case 'all':
      visibleTodos = todos;
      break;
    case 'active':
      visibleTodos = filteredActiveTodos;
      break;
    case 'completed':
      visibleTodos = filteredCompletedTodos;
      break;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodoTitle.trim() === '') {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    const newTodoForAPI = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setErrorMessage('');
    const todoPromise = createTodo(newTodoForAPI);
    const temporaryTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setTempTodo(temporaryTodo);
    try {
      const receivedNewTodo = await todoPromise;

      setTodos([...todos, receivedNewTodo]);
      setNewTodoTitle('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number) => {
    setErrorMessage('');
    setDeletingTodoIds(currentIds => [...currentIds, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setDeletingTodoIds(currentIds => currentIds.filter(id => id !== todoId));

      newTodoField.current?.focus();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length !== 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={event => handleSubmit(event)}>
            <input
              ref={newTodoField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        {(todos.length !== 0 || tempTodo) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {/* This is a completed todo */}
              <TransitionGroup>
                {visibleTodos.map(todo => (
                  <CSSTransition key={todo.id} timeout={300} classNames="item">
                    <div
                      data-cy="Todo"
                      className={classNames('todo', {
                        completed: todo.completed,
                      })}
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

                      {/* Remove button appears only on hover */}
                      <button
                        type="button"
                        className="todo__remove"
                        data-cy="TodoDelete"
                        onClick={() => {
                          handleDelete(todo.id);
                        }}
                      >
                        ×
                      </button>

                      {/* overlay will cover the todo while it is being deleted or updated */}
                      <div
                        data-cy="TodoLoader"
                        className={classNames('modal overlay', {
                          'is-active': deletingTodoIds.includes(todo.id),
                        })}
                      >
                        <div
                          className={classNames('modal-background', {
                            'has-background-white-ter': true,
                          })}
                        />
                        <div className="loader" />
                      </div>
                    </div>
                  </CSSTransition>
                ))}

                {/* This todo is in loadind state */}
                {tempTodo && (
                  <CSSTransition key={0} timeout={300} classNames="temp-item">
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
                      <div
                        data-cy="TodoLoader"
                        className="modal overlay is-active"
                      >
                        <div
                          className={classNames('modal-background', {
                            'has-background-white-ter': true,
                          })}
                        />
                        <div className="loader" />
                      </div>
                    </div>
                  </CSSTransition>
                )}
              </TransitionGroup>
            </section>

            {/* Hide the footer if there are no todos */}
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {filteredActiveTodos.length} items left
              </span>

              {/* Active link should have the 'selected' class */}
              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: selectedFilter === 'all',
                  })}
                  data-cy="FilterLinkAll"
                  onClick={() => setSelectedFilter('all')}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: selectedFilter === 'active',
                  })}
                  data-cy="FilterLinkActive"
                  onClick={() => setSelectedFilter('active')}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: selectedFilter === 'completed',
                  })}
                  data-cy="FilterLinkCompleted"
                  onClick={() => setSelectedFilter('completed')}
                >
                  Completed
                </a>
              </nav>

              {/* this button should be disabled if there are no completed todos */}

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={filteredCompletedTodos.length === 0}
                onClick={() => {
                  filteredCompletedTodos.forEach(todo => {
                    handleDelete(todo.id);
                  });
                }}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorMessage === '',
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
      </div>
    </div>
  );
};
