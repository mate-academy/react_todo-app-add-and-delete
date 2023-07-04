import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo } from './api/api';
import { Filter } from './types/types';
import { TodoList } from './components/TodoList';

const USER_ID = 10917;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);

  const [todoTitle, setTodoTitle] = useState<string>('');
  const [filter, setFilter] = useState<string | null>('');
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get(`/todos?userId=${USER_ID}`);

        setVisibleTodos(response as Todo[]);
        setTodos(response as Todo[]);
      } catch (error) {
        throw new Error('Data not found');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setVisibleTodos(todos.filter((todo) => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return true;
      }
    }));
  }, [filter, todos]);

  const changeTitleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const clearForm = () => {
    setTodoTitle('');
  };

  const submitHandler = async () => {
    if (!todoTitle) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    setIsLoading(true);

    await addTodo(todoTitle, setTodos, setTempTodo, setErrorMessage);

    setIsLoading(false);

    clearForm();
  };

  const clearCompletedHandler = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed);
      const deletedTodos = completedTodos
        .map(todo => deleteTodo(todo.id, setTodos, setErrorMessage));

      await Promise.all(deletedTodos);
    } catch (error) {
      setErrorMessage('Unable to delete completed todos');
      throw new Error('Error');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.some(todo => !todo.completed)}
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button type="button" className="todoapp__toggle-all active" />

          {/* Add a todo on form submit */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitHandler();
            }}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={changeTitleHandler}
              disabled={isLoading}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {isLoading && (
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">Todo is being saved now</span>
              <button type="button" className="todo__remove">×</button>

              {/* 'is-active' class puts this modal on top of the todo */}
              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
          <TodoList
            visibleTodos={visibleTodos}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
          />
          {/* This todo is being edited */}
          {tempTodo && (
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>
              <form>
                <input
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={tempTodo.title}
                />
              </form>
              <div className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter">
              <a
                href="#/"
                className={classNames(
                  'filter__link',
                  { selected: filter === '' },
                )}
                onClick={() => setFilter('')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames(
                  'filter__link',
                  { selected: filter === 'Active' },
                )}
                onClick={() => setFilter('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames(
                  'filter__link',
                  { selected: filter === 'Completed' },
                )}
                onClick={() => setFilter('Completed')}
              >
                Completed
              </a>
            </nav>

            {todos.filter(todo => todo.completed).length !== 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={clearCompletedHandler}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>
      {/* Add the 'hidden' class to hide the message smoothly */}
      {errorMessage && (
        <div
          className="
          notification
          is-danger
          is-light
          has-text-weight-normal"
        >
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          <br />
          {errorMessage}
          <br />
        </div>
      )}
    </div>
  );
};
