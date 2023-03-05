/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent } from 'react';
import classNames from 'classnames';

type Props = {
  title: string;
  hasActive: boolean;
  isTodoAdding: boolean;
  handleAddTodo: () => void;
  setTitle: React.Dispatch<string>;
  setHasError: React.Dispatch<boolean>;
  setErrorType: React.Dispatch<string>;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  hasActive,
  setHasError,
  setErrorType,
  isTodoAdding,
  handleAddTodo,
}) => {
  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setHasError(true);
      setErrorType('empty title');

      return;
    }

    handleAddTodo();
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: hasActive,
        })}
        disabled={!hasActive}
      />

      <form
        onSubmit={onFormSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          disabled={isTodoAdding}
        />
      </form>

    </header>
  );
};
