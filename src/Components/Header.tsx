import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  isActiveTodos: Todo[],
  title: string,
  handleNewTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onAddNewTodo: (title: string) => void,
  isDisabledInput: boolean,
};

export const Header: React.FC<Props> = ({
  isActiveTodos,
  title,
  handleNewTitle,
  onAddNewTodo,
  isDisabledInput,
}) => {
  const hanleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddNewTodo(title);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActiveTodos },
        )}
        aria-label="Add todo"
      />
      <form
        onSubmit={hanleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleNewTitle}
          disabled={isDisabledInput}
        />
      </form>
    </header>
  );
};
