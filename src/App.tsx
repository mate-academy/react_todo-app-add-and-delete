/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';

const USER_ID = 11361;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [updatedTodos, setUptatedTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('all');
  const [isTodoDeleted, setIsTodoDeleted] = useState(false);
  const [todosNotCompleted, setTodosNotCompleted] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoadingTodo, setIsLoadingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setIsLoading(true);
    async function fetchTodos() {
      try {
        const data = await getTodos(USER_ID);

        setTodos(data);
        setUptatedTodos(data);
        setTodosNotCompleted(
          data.filter(todo => todo.completed === false).length,
        );
      } catch (error) {
        setErrorMessage('Unable to load a todo');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodos();
    setIsTodoDeleted(false);
  }, [isTodoDeleted, tempTodo]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      switch (sortBy) {
        case 'completed':
          return todo.completed === true;
        case 'active':
          return todo.completed === false;
        case 'all':
          return todo;
        default:
          return todo;
      }
    });

    setUptatedTodos(filteredTodos);
  }, [sortBy]);

  const deleteOneTodo = async (todoId: number) => {
    try {
      await deleteTodo(USER_ID, todoId);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    }

    setIsTodoDeleted(true);
    setSelectedTodo(prevSelectedTodo => [...prevSelectedTodo, todoId]);
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!inputValue) {
        setErrorMessage("Title can't be empty");
      }

      setIsLoadingTodo(true);

      setTempTodo({
        id: 0,
        userId: 11361,
        title: inputValue,
        completed: false,
      });

      const todo = {
        id: 0,
        userId: 11361,
        title: inputValue,
        completed: false,
      };

      setInputValue('');

      try {
        await addTodo(USER_ID, todo);
      } catch (error) {
        setErrorMessage('Unable to add a todo');
      } finally {
        setIsLoadingTodo(false);
        setTempTodo(null);
      }
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          {/* Add a todo on form submit */}
          <form>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoadingTodo}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {updatedTodos.map(todo => (
            <div
              className={todo.completed ? 'todo completed' : 'todo'}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span className="todo__title">
                {todo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                onClick={() => deleteOneTodo(todo.id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being updated */}
              <div
                className={(isLoading && selectedTodo.includes(todo.id))
                  ? 'modal overlay is-active'
                  : 'modal overlay'}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo && (
            <div
              className="todo"
              key={tempTodo.id}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={false}
                />
              </label>

              <span className="todo__title">
                {tempTodo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                onClick={() => deleteOneTodo(tempTodo.id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being updated */}
              <div
                className="modal overlay is-active"
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer">
          <span className="todo-count">
            {todosNotCompleted}
            {' '}
            items left
          </span>

          {/* Active filter should have a 'selected' class */}
          <nav className="filter">
            <a
              href="#/"
              className={sortBy === 'all'
                ? 'filter__link selected'
                : 'filter__link'}
              onClick={() => setSortBy('all')}
            >
              All
            </a>

            <a
              href="#/active"
              className={sortBy === 'active'
                ? 'filter__link selected'
                : 'filter__link'}
              onClick={() => setSortBy('active')}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={sortBy === 'completed'
                ? 'filter__link selected'
                : 'filter__link'}
              onClick={() => setSortBy('completed')}
            >
              Completed
            </a>
          </nav>

          {/* don't show this button if there are no completed todos */}
          <button
            type="button"
            data-cy="ClearCompletedButton"
            className="todoapp__clear-completed"
            disabled={todosNotCompleted === todos.length}
            onClick={() => {
              todos.forEach(todo => {
                if (todo.completed === true) {
                  deleteOneTodo(todo.id);
                }
              });
            }}
          >
            Clear completed
          </button>

        </footer>
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        className={errorMessage
          ? 'notification is-danger is-light has-text-weight-normal'
          : 'notification is-danger is-light has-text-weight-normal hidden'}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
