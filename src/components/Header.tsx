import { useEffect, useRef } from 'react';

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  onTitleChange: (title: string) => void;
  isAdding: boolean;
};

export const Header: React.FC<Props> = (props) => {
  const {
    onSubmit,
    title,
    onTitleChange,
    isAdding,
  } = props;
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
        aria-label="Toggle All"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => onTitleChange(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
