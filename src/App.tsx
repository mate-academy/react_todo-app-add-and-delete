/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodos, getTodos, postTodos } from './api/todos';
import { Todo } from './types/Todo';
import cn from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [shouldFocusInput, setShouldFocusInput] = useState(true);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const todosResponse = await getTodos();
        setTodos(todosResponse);
      } catch (errorTodo) {
        setError('Unable to load todos');
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  }, [todos.length, loadingTodoId, tempTodo]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'Active':
        return todos.filter(todo => !todo.completed);
      case 'Completed':
        return todos.filter(todo => todo.completed);
      case 'All':
      default:
        return todos;
    }
  }, [todos, filter]);

  const todosCounter = useMemo(() => {
    const incompleteTodosCount = todos.filter(todo => !todo.completed).length;
    return `${incompleteTodosCount} ${incompleteTodosCount === 1 ? 'item' : 'items'} left`;
  }, [todos]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedText = inputText.trim();
    if (!trimmedText) {
      setError('Title should not be empty');
      setTimeout(() => {
        setError(null);
      }, 3000);
      setShouldFocusInput(true);
      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedText,
      completed: false,
      userId: USER_ID,
    });

    try {
      const newTodo = await postTodos(trimmedText, USER_ID);
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTempTodo(null);
      setError(null);
      setInputText('');
      setShouldFocusInput(true);
    } catch (error) {
      setError('Unable to add a todo');
      setTimeout(() => {
        setError(null);
      }, 3000);
      setTempTodo(null);
      setShouldFocusInput(true);
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingTodoId(id);
    try {
      await deleteTodos(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      setError(null);
    } catch (errorTodo) {
      setError('Unable to delete a todo');
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoadingTodoId(null);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => deleteTodos(todo.id).then(
      () => ({ status: 'fulfilled', id: todo.id }),
      (error) => ({ status: 'rejected', id: todo.id, error })
    ));

    const results = await Promise.all(deletePromises);

    const successfulDeletions = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.id);

    const failedDeletions = results
      .filter(result => result.status === 'rejected')
      .map(result => result.id);

    if (failedDeletions.length > 0) {
      setError('Unable to delete a todo');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }

    setTodos(prevTodos => prevTodos.filter(todo => !successfulDeletions.includes(todo.id)));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

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
          <form onSubmit={handleSubmit}>
            <input
              ref={newTodoFieldRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This todo is an active todo */}
          {filteredTodos.map(todo => (
            <div
              data-cy="Todo"
              className={cn('todo', { completed: todo.completed })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span data-cy="TodoTitle" key={todo.id} className="todo__title">
                {todo.title}
              </span>

              <div
                data-cy="TodoLoader"
                className={cn('modal', 'overlay', {
                  'is-active': loadingTodoId === todo.id,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDelete(todo.id)}
              >
                ×
              </button>
            </div>
          ))}
          {tempTodo && (
            <div
              data-cy="Todo"
              className={cn('todo', { completed: tempTodo.completed })}
              key={tempTodo.id}
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
                onClick={() => handleDelete(tempTodo.id)}
              >
                ×
              </button>
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}

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
        </div> */}

          {/* This todo is in loading state */}
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
        {todos.length !== 0 && (
          <footer
            className={cn('todoapp__footer', { hidden: !todos.length })}
            data-cy="Footer"
          >
            <span className="todo-count" data-cy="TodosCounter">
              {todosCounter}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'All' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('All')}
              >
                All
              </a>
              <a
                href="#/active"
                className={`filter__link ${filter === 'Active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('Active')}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={`filter__link ${filter === 'Completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('Completed')}
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
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
