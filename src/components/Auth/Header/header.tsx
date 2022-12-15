/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef } from 'react';

type Props = {
  title: string,
  onSetTitle: (value: string) => void,
  onSubmit: (event: React.FormEvent) => void;
};

export const Header: React.FC<Props> = ({
  title,
  onSetTitle,
  onSubmit,
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
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => onSetTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
