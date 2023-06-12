import React, { FormEvent } from 'react';
import classNames from 'classnames';

type Props = {
  title: string;
  hasActive: boolean;
  isTodoAdding: boolean;
  onAdd: () => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setErrorType: React.Dispatch<React.SetStateAction<string>>;
};

export const Header: React.FC<Props> = ({
  title,
  onAdd,
  setTitle,
  hasActive,
  isTodoAdding,
  setErrorType,
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorType('empty title');

      return;
    }

    onAdd();
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="toggle all todos statuses"
        className={classNames('todoapp__toggle-all', {
          active: hasActive,
        })}
        disabled={!hasActive}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isTodoAdding}
        />
      </form>
    </header>
  );
};
