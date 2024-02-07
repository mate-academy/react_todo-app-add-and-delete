/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID } from './constants';
import { FilterBy } from './types/FilterBy';
import { Todo } from './types/Todo';
import * as api from './api/todos';
import { getVisibleTodos } from './services/getVisibleTodos';
import { TodoItem } from './components/TodoItem';
import { Filter } from './components/Filter';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [query, setQuery] = useState<FilterBy>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputElement = useRef<HTMLInputElement>(null);

  function removeErrorNotification() {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  function loadTodos() {
    if (inputElement.current) {
      inputElement.current.focus();
    }

    setErrorMessage('');

    api.getTodos(USER_ID)
      .then(setTodosFromServer)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }

  useEffect(loadTodos, []);
  useEffect(removeErrorNotification, [errorMessage]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputText.trim().length) {
      setErrorMessage('Title should not be empty');

      return;
    }

    inputElement.current?.setAttribute('disabled', 'true');

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: inputText.trim(),
      completed: false,
    });

    api.createTodo({
      title: inputText.trim(),
      completed: false,
      userId: USER_ID,
    })
      .then((newTodo) => {
        setTodosFromServer((currTodos) => {
          return [...currTodos, newTodo];
        });

        setInputText('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        inputElement.current?.removeAttribute('disabled');
        inputElement.current?.focus();

        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    api.deleteTodo(todoId)
      .then(() => {
        setTodosFromServer(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getVisibleTodos(todosFromServer, query);
  const sumOfActiveTodos = todosFromServer.reduce((sum, todo) => {
    if (!todo.completed) {
      return sum + 1;
    }

    return sum;
  }, 0);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">
        todos
      </h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={(event) => handleSubmit(event)}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputText}
              onChange={(event) => setInputText(event.currentTarget.value)}
              ref={inputElement}
            />
          </form>
        </header>

        {!!todosFromServer.length && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoItem
                todo={todo}
                key={todo.id}
                onDelete={() => handleDelete(todo.id)}
              />
            ))}
            {tempTodo && <TodoItem todo={tempTodo} />}
          </section>
        )}

        {/* Hide the footer if there are no todos */}
        {!!todosFromServer.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${sumOfActiveTodos} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <Filter setQuery={setQuery} query={query} />

            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
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
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
