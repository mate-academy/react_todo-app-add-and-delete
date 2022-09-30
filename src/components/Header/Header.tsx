import React, { Dispatch, FormEvent, SetStateAction } from 'react';
import classNames from 'classnames';

type Props = {
  isLeftActiveTodos: boolean;
  newTodoField: React.RefObject<HTMLInputElement>,
  onAddTodo: (event: FormEvent) => void,
  title: string,
  setTitle: Dispatch<SetStateAction<string>>,
  isDisabled: boolean,
};

export const Header: React.FC<Props> = ({
  isLeftActiveTodos,
  newTodoField,
  onAddTodo,
  title,
  setTitle,
  isDisabled,
}) => {
  return (
    <header className="todoapp__header">
      <button
        aria-label="active"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isLeftActiveTodos },
        )}
      />

      <form onSubmit={onAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
