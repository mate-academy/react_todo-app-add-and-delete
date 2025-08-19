/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// Your userId is 3341
// Please use it for all your requests to the Students API. For example:
// https://mate.academy/students-api/todos?userId=3341

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState('all');

  const [errorMessage, setErrorMessage] = useState('');
  const ERROR_MESSAGE_LIFETIME_MS = 3000;

  const newTodoField = useRef<HTMLInputElement>(null);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [processingIds, setProcessingIds] = useState<number[]>([]);

  // show and clear error messages
  const showError = (message: string = 'Error') => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, ERROR_MESSAGE_LIFETIME_MS);
  };

  // focus input
  useEffect(() => {
    newTodoField.current?.focus();
  }, []);

  // load todo
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, []);

  const handleClearCompleted = async () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    try {
      setProcessingIds(prev => [...prev, ...completedTodoIds]);
      await Promise.all(completedTodoIds.map(deleteTodo));
      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch (error) {
      showError('Unable to delete a todo');
    } finally {
      setProcessingIds(prev =>
        prev.filter(id => !completedTodoIds.includes(id)),
      );
    }
  };

  const handleToggleTodo = (todoId: number) => {
    setTodos(prev =>
      prev.map(t => (t.id === todoId ? { ...t, completed: !t.completed } : t)),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = newTodoField.current;

    if (!input) {
      return;
    }

    const title = input.value.trim();

    if (!title) {
      showError('Title should not be empty');

      return;
    }

    input.disabled = true;

    // creating a temp todo and save it to the state
    setTempTodo({
      id: 0, // api will override it anyway, so we can put any number
      userId: USER_ID,
      title,
      completed: false,
    });

    try {
      const newTodo = await addTodo({
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);
      input.value = '';
    } catch (error) {
      showError('Unable to add a todo');
    } finally {
      input.disabled = false;
      input.focus();

      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setProcessingIds(prev => [...prev, todoId]);
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      showError('Unable to delete a todo');
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;

  const visibleTodos = todos.filter(todo => {
    switch (filterBy) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {/* //! todo header */}
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${todos.length > 0 && completedTodosCount === todos.length ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={() => {
              const areAllCompleted = completedTodosCount === todos.length;

              setTodos(prev =>
                prev.map(todo => ({
                  ...todo,
                  completed: !areAllCompleted,
                })),
              );
            }}
          />

          {/* Added a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={newTodoField}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* //! todos from API */}
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
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
                      onChange={() => handleToggleTodo(todo.id)}
                      checked={todo.completed}
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {todo.title}
                  </span>

                  {/* Remove button appears only on hover */}
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>

                  {/* overlay will cover the todo while it is being deleted or updated */}
                  <div
                    data-cy="TodoLoader"
                    className={classNames('modal overlay', {
                      'is-active': processingIds.includes(todo.id),
                    })}
                  >
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              </CSSTransition>
            ))}
            {/* //! temp todo */}
            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <div
                  key={tempTodo.id}
                  data-cy="Todo"
                  className={`todo ${tempTodo.completed ? 'completed' : ''}`}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      onChange={() => handleToggleTodo(tempTodo.id)}
                      checked={tempTodo.completed}
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>

                  {/* Remove button appears only on hover */}
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
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {/* //! todo footer  */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filterBy === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilterBy('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filterBy === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilterBy('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filterBy === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterBy('completed')}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={completedTodosCount === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* //! todo errors */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
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
