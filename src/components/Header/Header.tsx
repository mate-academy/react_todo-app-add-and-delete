import { useCallback, useEffect, useRef, useState } from 'react';
import '../../styles/todoapp.scss';

interface Props {
  onAdd: (title: string) => Promise<void>;
}

export const Header: React.FC<Props> = ({ onAdd }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const submitHandler = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmed = title.trim();

      setIsLoading(true);

      try {
        await onAdd(trimmed);
        setTitle('');
      } catch (error) {
        setTitle(trimmed);
      } finally {
        setIsLoading(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    },
    [title, onAdd],
  );

  const handleTitleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    [],
  );

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={submitHandler}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={title}
          ref={inputRef}
          placeholder="What needs to be done?"
          onChange={handleTitleInput}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
