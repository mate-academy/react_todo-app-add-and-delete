import { useState } from 'react';
import * as apiService from '../../api/todos';

export const Header: React.FC<{
  addTodo: (todo: {
    title: string;
    userId: number;
    completed: boolean;
  }) => void;
  setErrorMessage: (message: string | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  title: string;
  setTitle: (value: string) => void;
}> = ({ addTodo, setErrorMessage, inputRef, title, setTitle }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setLoading(true);

    addTodo({ title, userId: apiService.USER_ID, completed: false });

    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  return (
    <header className="todoapp__header">
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
          autoFocus
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            setErrorMessage(null);
          }}
          disabled={loading}
        />
      </form>
    </header>
  );
};
