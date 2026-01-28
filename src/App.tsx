/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';

function filteredTodos(todos: Todo[], filterBy: string) {
  switch (filterBy) {
    case Filter.Active:
      return todos.filter(todo => !todo.completed);

    case Filter.Completed:
      return todos.filter(todo => todo.completed);

    case Filter.All:
    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.None);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const todosWithTempTodo = tempTodo ? [...todos, tempTodo] : todos;

  const visibleTodos = filteredTodos(todosWithTempTodo, filterBy);

  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(ErrorMessage.None);

    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.Load))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(ErrorMessage.None);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!isAdding && !isLoading && !isDeleting) {
      field.current?.focus();
    }
  }, [isAdding, isLoading, isDeleting]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const allTodosCompleted = (incomeTodos: Todo[]) =>
    incomeTodos.length > 0 && incomeTodos.every(todo => todo.completed);

  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setError(ErrorMessage.None);
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    setError(ErrorMessage.None);
    setIsAdding(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    });

    addTodo({
      title: normalizedTitle,
      completed: false,
    })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setError(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  }

  function handleDelete(todoId: number) {
    setIsDeleting(true);
    setDeletingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(ErrorMessage.Delete);
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== todoId));
        setIsDeleting(false);
      });
  }

  function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    setIsDeleting(true);

    completedTodos.forEach(todo => {
      setDeletingIds(prev => [...prev, todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setError(ErrorMessage.Delete);
        })
        .finally(() => {
          setDeletingIds(prev => prev.filter(id => id !== todo.id));
          setIsDeleting(false);
        });
    });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: allTodosCompleted(todos),
            })}
            data-cy="ToggleAllButton"
            disabled={todos.length === 0}
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              ref={field}
              disabled={isLoading || isAdding}
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section
          className={classNames('todoapp__main', {
            hidden: todos.length === 0,
          })}
          data-cy="TodoList"
        >
          {/* This is a completed todo */}
          {visibleTodos.map(todo => {
            return (
              <div
                data-cy="Todo"
                key={todo.id}
                className={classNames('todo', { completed: todo.completed })}
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
                  onClick={() => handleDelete(todo.id)}
                >
                  ×
                </button>

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div
                  data-cy="TodoLoader"
                  className={classNames('modal overlay', {
                    'is-active':
                      (tempTodo && todo === tempTodo) ||
                      deletingIds.includes(todo.id),
                    hidden: !(
                      (tempTodo && todo === tempTodo) ||
                      deletingIds.includes(todo.id)
                    ),
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterBy === Filter.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterBy(Filter.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterBy === Filter.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterBy(Filter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterBy === Filter.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterBy(Filter.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompleted}
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
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(ErrorMessage.None)}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
