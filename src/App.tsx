/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { wait } from './utils/fetchClient';
import { Status } from './types/Status';
import { TodoItem } from './components/TodoItem';
import { Errors } from './types/Errors';

const USER_ID = 211;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.none);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [sortBy, setSortBy] = useState<Status>(Status.All);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<number>(0);

  const titleInput = useRef<HTMLInputElement>(null);

  const isAllCompleted = todos.every(todo => todo.completed);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const isAnyCompletedTodo = todos.some(todo => todo.completed);
  let visibleTodos = todos;

  switch (sortBy) {
    case Status.Active:
      visibleTodos = visibleTodos.filter(todo => !todo.completed);
      break;

    case Status.Completed:
      visibleTodos = visibleTodos.filter(todo => todo.completed);
      break;

    default:
      break;
  }

  const handleError = (message: Errors) => {
    setErrorMessage(message);
    wait(3000).then(() => {
      setErrorMessage(Errors.none);

      if (titleInput.current) {
        titleInput.current.focus();
      }
    });
  };

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [todos.length]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => handleError(Errors.load));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const createTempTodo = () =>
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    });

  const handleSubmitNewTodo = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsDisabled(true);
    createTempTodo();

    if (newTodoTitle.trim() === '') {
      handleError(Errors.title);
      setIsDisabled(false);
      setTempTodo(null);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    addTodo(newTodo)
      .then(todo => {
        setTodos(prev => [...prev, todo]);
        setNewTodoTitle('');
      })
      .catch(() => handleError(Errors.add))
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (deletingPostId: number) => {
    deleteTodo(deletingPostId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== deletingPostId));
      })
      .catch(() => handleError(Errors.delete))
      .finally(() => setSelectedTodo(0));
  };

  const handleClearCompleted = () => {
    const deletingTodos = todos.filter(todo => todo.completed);

    deletingTodos.forEach(todo => handleDelete(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {!!todos.length && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isAllCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmitNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              name="new-todo"
              ref={titleInput}
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isDisabled}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          deleteTodo={handleDelete}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
        />

        {tempTodo && (
          <TodoItem
            id={tempTodo.id}
            completed={tempTodo.completed}
            title={tempTodo.title}
            selectedTodo={selectedTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: !sortBy,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setSortBy(Status.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: sortBy === Status.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setSortBy(Status.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: sortBy === Status.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setSortBy(Status.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!isAnyCompletedTodo}
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
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {!!errorMessage && errorMessage}
      </div>
    </div>
  );
};
