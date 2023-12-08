/* eslint-disable jsx-a11y/control-has-associated-label */

import { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { createTodo } from '../api/todos';
import { Todo } from '../types/Todo';

export type HeaderProps = {
  setErrorText: (error: string) => void
  saveResponse: (response: Todo) => void
  setTempTodo: (todo: Todo | null) => void
  leftItems: () => number
  delited: number
};

const USER_ID = 12004;

export const Header = ({
  setErrorText, saveResponse, setTempTodo, leftItems, delited,
}: HeaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [delited]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputRef.current?.value.trim()) {
      inputRef.current.disabled = true;

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: inputRef.current?.value.trim(),
        completed: false,
      });

      createTodo({
        userId: USER_ID,
        title: inputRef.current?.value.trim(),
        completed: false,
      }).then((response) => {
        saveResponse(response);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }).catch(() => {
        setErrorText('Unable to add a todo');
      }).finally(() => {
        setTempTodo(null);
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }
      });

      inputRef.current?.focus();
    } else {
      setErrorText('Title should not be empty');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all',
          { active: leftItems() > 0 })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={submit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
        />
      </form>
    </header>
  );
};
