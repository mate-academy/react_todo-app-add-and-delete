import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

type Props = {
  todos: Todo[],
  onError: (isError: Error) => void,
  addTodo: (value: string) => void;
  isInputActive: boolean,
};

export const Header: React.FC<Props> = ({
  todos, onError, addTodo, isInputActive,
}) => {
  const [value, setValue] = useState('');

  const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(value);
    setValue('');
  };

  const isActive = todos.some(todo => !todo.completed);

  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onError(Error.ADD);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActive },
        )}
        onClick={clickHandler}
        aria-label="toggleButton"
      />

      <form onSubmit={formSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={!isInputActive}
        />
      </form>
    </header>
  );
};
