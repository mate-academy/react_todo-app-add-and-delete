import { useEffect, useRef, useState } from 'react';

type Props = {
  onSubmit: (title: string) => void;
  onInput: () => void;
  inputDisabled: boolean;
  hasErrors: boolean;
};

export const Header: React.FC<Props> = (
  {
    onSubmit,
    onInput,
    inputDisabled,
    hasErrors,
  },
) => {
  const titleField = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [onSubmit]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(title);
    if (!hasErrors) {
      setTitle('');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    onInput();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="none"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={titleField}
          type="text"
          disabled={inputDisabled}
          value={title}
          onChange={handleInputChange}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
