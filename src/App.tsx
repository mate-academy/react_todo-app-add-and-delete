/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { Todo } from './types/Todo';
import { FilterTypes } from './types/FilterTypes';
import { ErrorTypes } from './types/ErrorTypes';

import { getTodos, createTodo, deleteTodo } from './api/todos';
import { RequestTodoBody } from './types/RequestTodo';

const USER_ID = 10329;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorTypes>(ErrorTypes.NoError);
  const [isError, setIsError] = useState(false);
  const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.All);
  const [todoTitle, setTodoTitle] = useState('');
  const [inputDisable, setInputDisable] = useState(false);
  const [tempTodo, setTempTodo] = useState<RequestTodoBody | null>(null);
  const [waitForDeletingTodoId, setWaitForDeletingTodoId] = useState<number | null>(null);

  const visibleTodos = useMemo(() => {
    const preperedTodos = [...todos];

    switch (filterType) {
      case FilterTypes.Active:
        return preperedTodos.filter(todo => !todo.completed);

      case FilterTypes.Complited:
        return preperedTodos.filter(todo => todo.completed);

      default:
        return preperedTodos;
    }
  }, [todos, filterType]);

  const hideNotifications = () => {
    setTimeout(() => {
      setIsError(false);
    }, 3000);
  };

  const fetchTodos = async () => {
    try {
      const newTodos = await getTodos(USER_ID);

      setTodos(newTodos);
      setInputDisable(false);
    } catch (error1) {
      setError(ErrorTypes.UnableToShowTodos);
      setIsError(true);
      hideNotifications();
    }
  };

  const hendlerAddTodo = async () => {
    if (!todoTitle) {
      setError(ErrorTypes.UnableToAddTodo);
      setIsError(true);
      hideNotifications();

      return;
    }

    setInputDisable(true);

    const newData = {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    setTodoTitle('');

    setTempTodo(newData);

    try {
      setIsError(false);
      await createTodo(USER_ID, newData);
      fetchTodos();
    } catch (error2) {
      setError(ErrorTypes.UnableToAddTodo);
      setIsError(true);
      hideNotifications();
    }

    setTempTodo(null);
  };

  const handlerDeleteTodo = async (todoId: number) => {
    setWaitForDeletingTodoId(todoId);

    try {
      await deleteTodo(todoId);
      fetchTodos();
    } catch (error3) {
      setError(ErrorTypes.UnableToDeleteTodo);
      setIsError(true);
      hideNotifications();
      setWaitForDeletingTodoId(null);
    }
  };

  const handlerDeleteCompletedtodo = async () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handlerDeleteTodo(todo.id);
      }
    });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all',
              { active: !todos.some(todo => todo.completed === false) },
              { 'is-invisible': !todos.length })}
          />

          <form
            onSubmit={(event) => {
              event.preventDefault();
              hendlerAddTodo();
            }}
          >
            <fieldset disabled={inputDisable}>
              <input
                type="text"
                className="todoapp__new-todo disabled"
                placeholder="What needs to be done?"
                value={todoTitle}
                onChange={event => {
                  setTodoTitle(event.target.value);
                }}
              />
            </fieldset>
          </form>
        </header>

        <section className="todoapp__main">
          {visibleTodos.map(todo => (
            <div
              key={todo.id}
              className={classNames(
                'todo',
                { completed: todo.completed },
              )}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span className="todo__title">{todo.title}</span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => handlerDeleteTodo(todo.id)}
              >
                ×
              </button>

              <div
                className={classNames('modal overlay',
                  { 'is-active': todo.id === waitForDeletingTodoId })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {tempTodo && (
            <div className="todo">
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span className="todo__title">{tempTodo?.title}</span>

              <button
                type="button"
                className="todo__remove"
              >
                ×
              </button>

              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {todos.length}
              {' items left'}
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={classNames('filter__link',
                  { selected: filterType === FilterTypes.All })}
                onClick={() => setFilterType(FilterTypes.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link',
                  { selected: filterType === FilterTypes.Active })}
                onClick={() => setFilterType(FilterTypes.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link',
                  { selected: filterType === FilterTypes.Complited })}
                onClick={() => setFilterType(FilterTypes.Complited)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className={classNames('todoapp__clear-completed',
                { 'is-invisible': !todos.some(todo => todo.completed === true) })}
              onClick={handlerDeleteCompletedtodo}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div className={classNames('notification is-danger is-light has-text-weight-normal',
        { hidden: !isError })}
      >
        <button
          type="button"
          className="delete"
          onClick={hideNotifications}
        />
        {error}
      </div>
    </div>
  );
};
