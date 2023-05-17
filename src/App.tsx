/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { getTodos, createTodo, deleteTodo } from './api/todos';

const USER_ID = 10329;

enum FilterTypes {
  All,
  Active,
  Complited,
}

enum ErrorTypes {
  NoError,
  UnableToShowTodos = 'Unable to show todos',
  UnableToAddTodo = 'Unable to add a todo',
  UnableToDeleteTodo = 'Unable to delete a todo',
  UnableToUpdateTodo = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorTypes>(ErrorTypes.NoError);
  const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.All);
  const [todoTitle, setTodoTitle] = useState('');
  const [inputDisable, setInputDisable] = useState(false);
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
      setError(ErrorTypes.NoError);
    }, 3000);
  };

  const fetchTodos = async () => {
    try {
      const newTodos = await getTodos(USER_ID);

      setTodos(newTodos);
      setInputDisable(false);
      setWaitForDeletingTodoId(null);
    } catch (error1) {
      setError(ErrorTypes.UnableToShowTodos);
      hideNotifications();
    }
  };

  const hendlerAddTodo = async () => {
    setInputDisable(true);

    visibleTodos.push({
      id: 0,
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    });

    const newData = {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    setTodoTitle('');

    try {
      await createTodo(USER_ID, newData);
      fetchTodos();
    } catch (error2) {
      setError(ErrorTypes.UnableToAddTodo);
      visibleTodos.pop();
      hideNotifications();
    }
  };

  const handlerDeleteTodo = async (todoId: number) => {
    setWaitForDeletingTodoId(todoId);

    try {
      await deleteTodo(todoId);
      fetchTodos();
    } catch (error3) {
      setError(ErrorTypes.UnableToDeleteTodo);
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
                  { 'is-active': todo.id === 0 || todo.id === waitForDeletingTodoId })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
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

      {error !== ErrorTypes.NoError && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
            onClick={() => setError(ErrorTypes.NoError)}
          />
          {error}
        </div>
      )}
    </div>
  );
};
