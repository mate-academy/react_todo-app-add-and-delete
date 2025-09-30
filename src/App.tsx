/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import {
  getTodos,
  addTodo as addTodoApi,
  deleteTodo as deleteTodoApi,
} from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

enum Filter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}
enum ErrorMessage {
  Empty = '',
  LoadError = 'Unable to load todos',
  TitleError = 'Title should not be empty',
  AddError = 'Unable to add a todo',
  DeleteError = 'Unable to delete a todo',
  UpdateError = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const completedTodosNumber = todos.filter(todo => !todo.completed).length;
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.Empty,
  );
  const [isAnyCompleted, setIsAnyCompleted] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeError = () => {
    setErrorMessage(ErrorMessage.Empty);
  };
  const fetchTodos = async () => {
    setErrorMessage(ErrorMessage.Empty);
    try {
      const data: Todo[] = await getTodos();
      setTodos(data);
    } catch (error) {
      setErrorMessage(ErrorMessage.LoadError);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.Empty);
      }, 3000);
    }
  };
  const selectNewFilter = (newFilter: Filter) => {
    setSelectedFilter(newFilter);
    switch (newFilter) {
      case Filter.All:
        setFilteredTodos(todos);
        break;
      case Filter.Active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      case Filter.Completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
      default:
        setFilteredTodos(todos);
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);
  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading, todos]);
  const findCompletedTodos = () => {
    setIsAnyCompleted(todos.some(todo => todo.completed));
  };
  useEffect(() => {
    selectNewFilter(selectedFilter);
    findCompletedTodos();
  }, [todos]);
  if (!USER_ID) {
    return <UserWarning />;
  }
  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputRef.current?.value.trim()) {
      setErrorMessage(ErrorMessage.TitleError);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.Empty);
      }, 3000);
      return;
    }
    const title = inputRef.current.value.trim();
    const newTemp: Todo = {
      id: 0, // temporary ID
      userId: USER_ID,
      title,
      completed: false,
    };
    setTempTodo(newTemp);
    setLoading(true);

    try {
      const addTodoPost: Todo = await addTodoApi(newTemp);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      setTodos([...todos, addTodoPost]);
    } catch (error) {
      setErrorMessage(ErrorMessage.AddError);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.Empty);
      }, 3000);
      return null;
    } finally {
      setLoading(false);
      setTempTodo(null);
    }
  };
  const deleteTodo = async (id: number) => {
    setDeleteTodoId(id);
    try {
      await deleteTodoApi(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(ErrorMessage.DeleteError);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.Empty);
      }, 3000);

      return null;
    } finally {
      setDeleteTodoId(null);
    }
  };

  const deleteCompleted = async () => {
    await Promise.all(
      todos.filter(todo => todo.completed).map(todo => deleteTodo(todo.id)),
    );
  };
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
          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={inputRef}
              disabled={loading}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          {filteredTodos.map((todo, key) => (
            <div
              key={key}
              data-cy="Todo"
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
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': todo.id === deleteTodoId,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo && (
            <div
              key={tempTodo.id}
              data-cy="Todo"
              className={classNames('todo', { completed: tempTodo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
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
            </label>

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
          </div>  */}
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
            </button>

            {/* 'is-active' class puts this modal on top of the todo */}
          {/* <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>  */}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length ? (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {completedTodosNumber} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: selectedFilter === 'All',
                })}
                data-cy="FilterLinkAll"
                onClick={() => selectNewFilter(Filter.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: selectedFilter === 'Active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => selectNewFilter(Filter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: selectedFilter === 'Completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => selectNewFilter(Filter.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={() => deleteCompleted()}
                disabled={!isAnyCompleted }
              >
                Clear completed
              </button>

          </footer>
        ) : (
          ''
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => closeError()}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
