/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  deleteTodos,
  getTodos,
  postTodos,
  updateTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

export const App: React.FC = () => {
  const FILTERS = {
    all: 'All',
    completed: 'Completed',
    active: 'Active',
  };

  const ERRORS_MESSAGE = {
    loadError: 'Unable to load todos',
    titleError: 'Title should not be empty',
    addingError: 'Unable to add a todo',
    deleteError: 'Unable to delete a todo',
    updateError: 'Unable to update a todo',
  };

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(FILTERS.all);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addingTodoId, setAddingTodoId] = useState<number | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  useEffect(() => {
    const todosFromServer = async () => {
      try {
        const preparedTodos = await getTodos();

        setTodos(preparedTodos);
      } catch (err) {
        setError(ERRORS_MESSAGE.loadError);
      }
    };

    todosFromServer();
  }, [ERRORS_MESSAGE.loadError]);

  useEffect(() => {
    if (error) {
      const errorTimer = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(errorTimer);
    }
  }, [error]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [error, todos]);

  const getFilteredTodos = (todoList: Todo[], query: string) => {
    let filteredTodos = [...todoList];

    switch (query) {
      case FILTERS.active:
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
        break;

      case FILTERS.completed:
        filteredTodos = filteredTodos.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    return filteredTodos;
  };

  const visibleTodos = getFilteredTodos(todos, filter);

  interface TempTodo extends Todo {
    isTemp?: boolean;
  }

  const items = todos.filter(
    todo => !todo.completed && !(todo as TempTodo).isTemp,
  );

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ERRORS_MESSAGE.titleError);

      return;
    }

    setIsAdding(true);

    const tempId = Date.now();

    setAddingTodoId(tempId);

    const tempTodo: Todo & { isTemp?: boolean } = {
      id: tempId,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
      isTemp: true,
    };

    setTodos(prev => [...prev, tempTodo]);

    try {
      const newTodo = await postTodos({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prev => prev.map(todo => (todo.id === tempId ? newTodo : todo)));

      setTitle('');
    } catch {
      setError(ERRORS_MESSAGE.addingError);
      setTodos(prev => prev.filter(todo => todo.id !== tempId));
    } finally {
      setIsAdding(false);
      setAddingTodoId(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodoId(todoId);
    try {
      await deleteTodos(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError(ERRORS_MESSAGE.deleteError);
    } finally {
      setDeletingTodoId(null);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleDeleteCompleteTodo = async () => {
    interface DeleteResult {
      id: number;
      success: boolean;
    }

    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo =>
        deleteTodos(todo.id).then(
          () => ({ id: todo.id, success: true }),
          () => ({ id: todo.id, success: false }),
        ),
      ),
    );

    const failedIds = results
      .filter(
        (r): r is PromiseFulfilledResult<DeleteResult> =>
          r.status === 'fulfilled' && !r.value.success,
      )
      .map(r => r.value.id);

    if (
      results.some(
        r =>
          r.status === 'rejected' ||
          (r.status === 'fulfilled' && r.value.success === false),
      )
    ) {
      setError(ERRORS_MESSAGE.deleteError);
    }

    setTodos(prev =>
      prev.filter(todo => !todo.completed || failedIds.includes(todo.id)),
    );

    setTodos(prev =>
      prev.filter(todo => !todo.completed || failedIds.includes(todo.id)),
    );

    if (
      results.some(
        r =>
          r.status === 'rejected' ||
          (r.status === 'fulfilled' && r.value.success === false),
      )
    ) {
      setError(ERRORS_MESSAGE.deleteError);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const updatedTodo = await updateTodos(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
    } catch {
      setError(ERRORS_MESSAGE.updateError);
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const updatedStatus = !allCompleted;

    try {
      const updatedTodos = await Promise.all(
        todos.map(todo =>
          updateTodos(todo.id, { completed: updatedStatus })
            .then(updatedTodo => updatedTodo)
            .catch(() => {
              setError(ERRORS_MESSAGE.updateError);

              return todo;
            }),
        ),
      );

      setTodos(updatedTodos);
    } catch {
      setError(ERRORS_MESSAGE.updateError);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.length > 0 && todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
            onClick={handleToggleAll}
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          {visibleTodos.map(todo => (
            <div
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo)}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active':
                    todo.id === addingTodoId || todo.id === deletingTodoId,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {/* This todo is an active todo */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Not Completed Todo
            </span>
            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

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

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {items.length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === FILTERS.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(FILTERS.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === FILTERS.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(FILTERS.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === FILTERS.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(FILTERS.completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleDeleteCompleteTodo}
              disabled={!todos.some(todo => todo.completed)}
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
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
