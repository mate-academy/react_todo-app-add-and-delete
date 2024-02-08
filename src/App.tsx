/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { isError, tempTodo, todos } from './signals';
import { Error } from './components/Error/Error';
import { ErrorValues } from './types/ErrorValues';
import { postTodo } from './api/todos';

const USER_ID = 132;

const inputValue = signal<string>('');

export const App: React.FC = () => {
  useSignals();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputValue.value = e.target.value;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.value.trim()) {
      isError.value = ErrorValues.emptyTitle;
    } else {
      tempTodo.value = {
        id: 0,
        title: inputValue.value.trim(),
        completed: false,
        userId: USER_ID,
      };
      postTodo(tempTodo.value)
        .then((todo) => {
          todos.value = [...todos.value, todo];
          tempTodo.value = null;
          inputValue.value = '';
        })
        .catch(() => {
          isError.value = ErrorValues.add;
          tempTodo.value = null;
        })
        .finally(() => {
          inputRef.current?.focus();
        });
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
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={inputValue.value}
              onInput={handleInput}
              disabled={!!tempTodo.value}
            />
          </form>
        </header>
        {!!todos.value.length && (
          <TodoList />
        )}
      </div>
      <Error />

    </div>
  );
};
