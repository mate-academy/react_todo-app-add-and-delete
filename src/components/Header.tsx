import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

type Props = {
  onAdd: (title: string) => void;
  onError: (message: string) => void;
  isError: boolean;
  isLoading: boolean;
  isAllCompleted: boolean;
};

export const Header: React.FC<Props> = ({
  onAdd,
  onError,
  isError,
  isLoading,
  isAllCompleted,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      onError('Title should not be empty');
      setTimeout(() => onError(''), 3000);

      return;
    }

    onAdd(trimmedTitle);
    // if (!isLoading) {
    //   setTitle('');
    // }
  };

  useEffect(() => {
    if (!isLoading && !isError) {
      setTitle('');
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
