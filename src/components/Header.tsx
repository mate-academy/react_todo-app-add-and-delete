import React, { FormEvent } from 'react';
import classNames from 'classnames';

type Props = {
  title: string;
  hasActive: boolean;
  isTodoAdding: boolean;
  handleAddTodo: () => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorType: React.Dispatch<React.SetStateAction<string>>;
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
        aria-label="toggle all todo statuses"
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
