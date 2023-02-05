/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { ChangeEvent, FormEvent } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todoTitleToAdd: string,
  onNewTitleAdd: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void,
  activeTodos: Todo[],
  isInputDisabled: boolean,
};

export const Header: React.FC<Props> = ({
  todoTitleToAdd,
  onNewTitleAdd,
  onSubmit,
  activeTodos,
  isInputDisabled,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn(
          'todoapp__toggle-all active',
          { active: activeTodos.length > 0 },
        )}
      />
      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitleToAdd}
          onChange={onNewTitleAdd}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
