import { FormEvent, useEffect, useRef } from 'react';

type Props = {
  title: string;
  setTitle: (value: string) => void;
  handleSubmit: (event: FormEvent) => Promise<void>;
  isAdding: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  handleSubmit,
  isAdding,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="close"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
