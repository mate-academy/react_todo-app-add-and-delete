/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { FilterName } from './types/FilterName';
import * as todosService from './api/todos';

export const USER_ID = 1918;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterValue, setFilterValue] = useState<FilterName>('ALL');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [todoIdLoading, setTodoIdLoading] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const activeTodosQuantity = todos.filter(todo => !todo.completed).length;

  function loadTodos() {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }

  const filteredTodos = useMemo(() => {
    switch (filterValue) {
      case 'ACTIVE':
        return todos.filter(todo => !todo.completed);
      case 'COMPLETED':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterValue]);

  useEffect(() => {
    loadTodos();
    if (!inputDisabled && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [inputDisabled]);

  const handleNewTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
  };

  function addPost(loadingTodo: Todo) {
    setErrorMessage('');

    todosService
      .createTodo({
        userId: loadingTodo.userId,
        title: loadingTodo.title,
        completed: loadingTodo.completed,
      })
      .then(newTodo => {
        setTempTodo(null);
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        setTempTodo(null);
      })
      .finally(() => {
        setInputDisabled(false);
        if (inputRef.current) {
          inputRef.current?.focus();
        }
      });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!newTodoTitle.trim()) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    const loadingTodo: Todo = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
      id: 0,
    };

    setTempTodo(loadingTodo);
    setInputDisabled(true);
    addPost(loadingTodo);
  }

  function deletePost(todoId: number) {
    setTodoIdLoading(todoId);
    todosService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setTodoIdLoading(null);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTodoIdLoading(null);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        if (!inputDisabled && inputRef.current) {
          inputRef.current?.focus();
        }
      });
  }

  function deleteCompleted() {
    todos.map(todo => {
      if (todo.completed) {
        deletePost(todo.id);
      }
    });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: !activeTodosQuantity,
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleNewTodoTitleChange}
              disabled={inputDisabled}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map((todo: Todo) => (
              <div
                key={todo.id}
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

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => deletePost(todo.id)}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={classNames('modal', 'overlay', {
                    'is-active': todoIdLoading === todo.id,
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
            {tempTodo !== null && (
              <div
                data-cy="Todo"
                className={classNames('todo', {
                  completed: tempTodo.completed,
                })}
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
          </section>
        )}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosQuantity} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterValue === 'ALL',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterValue('ALL')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterValue === 'ACTIVE',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterValue('ACTIVE')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterValue === 'COMPLETED',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterValue('COMPLETED')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.length === activeTodosQuantity}
              onClick={() => deleteCompleted()}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

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
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
