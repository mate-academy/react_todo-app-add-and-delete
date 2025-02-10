import classNames from 'classnames';
import React, { FormEvent } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[] | null;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleSubmit: (event: FormEvent) => void;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  inputRef,
  handleSubmit,
  title,
  setTitle,
  disabled,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos?.filter(todo => !todo.completed).length === 0,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          onChange={event => setTitle(event.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
