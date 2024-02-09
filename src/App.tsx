/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';

const USER_ID = 106;

export const App: React.FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then((res) => setTempTodo(res));
  }, []);

  function removeTodo(todoId: number) {
    todoService.deleteTodo(todoId).then(() => {
      setTempTodo(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
    }).catch(() => {
      setError('Unable to delete a todo');
      setTimeout(() => setError(null), 3000);
    });
  }

  function addTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
    // setLoading(true);
    todoService.createTodo({ userId, title, completed })
      .then(newTodos => {
        setTempTodo((currentTodos: Todo[]) => [...currentTodos, newTodos as Todo]);
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTimeout(() => setError(null), 3000);
      });
    // .finally(() => setLoading(false));
  }

  const handleNewTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleNewTodoSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodo.trim() === '') {
      setError('Title should not be empty');
      setTimeout(() => setError(null), 3000);

      return;
    }

    addTodo({
      userId: USER_ID,
      title: newTodo.trim(),
      completed: false,
    });

    setNewTodo('');
  };

  const handleClearCompleted = () => {
    const completedTodos = tempTodo.filter((todo) => todo.completed);

    const deletePromises = completedTodos.map((todo) => {
      return todoService.deleteTodo(todo.id);
    });

    Promise.all(deletePromises)
      .then(() => {
        setTempTodo((currentTodos) => currentTodos.filter((todo) => !todo.completed));
      })
      .catch(() => {
        setError('Heve problem with DELETE COMPLITED');
        setTimeout(() => setError(null), 3000);
      });
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  function filteredTodos() {
    if (activeFilter === 'all') {
      return tempTodo;
    }

    if (activeFilter === 'active') {
      return tempTodo.filter(todo => !todo.completed);
    }

    if (activeFilter === 'completed') {
      return tempTodo.filter(todo => todo.completed);
    }

    return tempTodo;
  }

  const filteredTodosList: Todo[] = filteredTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {tempTodo.length !== 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleNewTodoSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={handleNewTodoChange}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              // disabled={loading}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodosList.map(todo => (
            <React.Fragment key={todo.id}>
              {!todo.completed ? (
                <div data-cy="Todo" className="todo">
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {todo.title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => removeTodo(todo.id)}
                  >
                    ×
                  </button>

                  <div data-cy="TodoLoader" className="modal overlay">
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              ) : (
                <div data-cy="Todo" className="todo completed">
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => removeTodo(todo.id)}
                  >
                    ×
                  </button>

                  {/* overlay will cover the todo while it is being updated */}
                  <div data-cy="TodoLoader" className="modal overlay">
                    <div
                      className="modal-background has-background-white-ter"

                    />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {/* This todo is being edited */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label> */}
          {/* This form is shown instead of the title and remove button */}
          {/* <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

          {/* This todo is in loadind state */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Todo is being saved now
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button> */}

          {/* 'is-active' class puts this modal on top of the todo */}

          {/* <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}
        </section>

        {filteredTodosList.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${filteredTodosList.length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: activeFilter === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => handleFilterChange('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: activeFilter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => handleFilterChange('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: activeFilter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => handleFilterChange('completed')}
              >
                Completed
              </a>
            </nav>

            {/* don't show this button if there are no completed todos */}
            {tempTodo.filter((todo) => todo.completed).length > 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleClearCompleted}
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
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setError(null)}
          />
          {error}
        </div>
      )}
    </div>
  );
};
