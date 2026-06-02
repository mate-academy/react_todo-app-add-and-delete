/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { USER_ID, getTodos } from './api/todos';
import { addTodo, deleteTodo } from './api/todos';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>('');
  const [filter, setFilter] = useState<FilterType>('all');

  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [todoIdsInProgress, setTodoIdsInProgress] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (message: ErrorType) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const loadTodos = async () => {
    try {
      setErrorMessage('');
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch {
      showError('Unable to load todos');
    }
  };

  useEffect(() => {
    loadTodos();

    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

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

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      showError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    setErrorMessage('');
    setIsAdding(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    try {
      const createdTodo = await addTodo(title);

      setTodos(prev => [...prev, createdTodo]);
      setNewTodoTitle('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setTodoIdsInProgress(prev => [...prev, id]);
    setErrorMessage('');

    try {
      await deleteTodo(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setTodoIdsInProgress(prev => prev.filter(todoId => todoId !== id));

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => handleDeleteTodo(todo.id)));
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
            className={`todoapp__toggle-all ${!!todos.length && todos.every(todo => todo.completed) ? 'active' : ''}`}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
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
                    readOnly
                    disabled={todoIdsInProgress.includes(todo.id)}
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
                  disabled={todoIdsInProgress.includes(todo.id)}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${todoIdsInProgress.includes(todo.id) ? 'is-active' : ''}`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}

            {tempTodo && (
              <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input type="checkbox" className="todo__status" disabled />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>

                <button type="button" className="todo__remove" disabled>
                  ×
                </button>

                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}

        {/* Hide the footer if there are no todos */}
        {(todos.length > 0 || tempTodo) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
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
              disabled={!todos.some(todo => todo.completed)}
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
          notification
          is-danger
          is-light
          has-text-weight-normal
          ${!errorMessage ? 'hidden' : ''}
          `}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};
