import { FormEvent, useEffect } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>
  title: string,
  onChange: (searchQuery: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void,
  isAdding: boolean,
};

export const Header: React.FC<Props> = ({
  newTodoField,
  title,
  onChange,
  onSubmit,
  isAdding,
}) => {
  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={(e) => onSubmit(e)}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => onChange(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
