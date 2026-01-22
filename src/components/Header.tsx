import { useEffect, useRef, useState } from 'react';

interface Props {
  onSubmit: (title: string) => Promise<void>;
  onError: (msg: string) => void;
  processings: number[];
}

export const Header: React.FC<Props> = ({ onSubmit, onError, processings }) => {
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const titleField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!creating) {
      titleField.current?.focus();
    }
  }, [creating, processings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError('Title should not be empty');
      setTimeout(() => {
        onError('');
      }, 3000);

      return;
    }

    setCreating(true);
    onSubmit(trimmedTitle)
      .then(() => {
        setTitle('');
      })
      .catch(() => setTitle(trimmedTitle))
      .finally(() => {
        setCreating(false);
        titleField.current?.focus();
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          disabled={creating}
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => {
            setTitle(e.target.value);
            onError('');
          }}
        />
      </form>
    </header>
  );
};
