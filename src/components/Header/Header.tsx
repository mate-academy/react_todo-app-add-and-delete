/* eslint-disable jsx-a11y/control-has-associated-label */
import { FormEvent, memo, useState } from 'react';

interface HeaderProps {
  newTodoField: React.RefObject<HTMLInputElement>;
  showError: (message: string) => void,
}

export const Header: React.FC<HeaderProps> = memo(
  ({ newTodoField, showError }) => {
    const [title, setTitle] = useState('');

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        showError('Title is required');
      }
    };

    return (
      <header className="todoapp__header">
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />

        <form
          onSubmit={handleFormSubmit}
        >
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </form>
      </header>
    );
  },
);
