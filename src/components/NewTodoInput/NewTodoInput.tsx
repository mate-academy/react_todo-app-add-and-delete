/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  isButtonActive: boolean,
  title: string,
  setTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onFormSubmit: (event: React.FormEvent) => void,
  isInputDisabled: boolean,
};

export const NewTodoInput:
React.FC<Props> = React.memo(({
  isButtonActive,
  title,
  setTitle,
  onFormSubmit,
  isInputDisabled,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isButtonActive },
        )}
      />

      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isInputDisabled}
          value={title}
          onChange={setTitle}
        />
      </form>
    </header>
  );
});
