import { useState } from 'react';
import { Todo } from '../../types/Todo';

interface HeaderProps {
  onAdd: (todo: Partial<Todo>) => Promise<unknown>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

export const Header: React.FC<HeaderProps> = ({ onAdd, inputRef }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAdd({ title }).then(() => setTitle(''));
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          autoFocus
        />
      </form>
    </header>
  );
};
