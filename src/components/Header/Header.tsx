import { useState, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  onAdd: (title: string) => void;
  adding: boolean;
  errorMessage: string | null;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  onAdd,
  adding,
  errorMessage,
  todos,
}) => {
  const [title, setTitle] = useState('');
  const inputFocused = useRef<null | HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onAdd(title.trim());
  };

  useEffect(() => {
    if ((errorMessage?.length ?? 0) === 0 && !adding) {
      setTitle('');
    }

    inputFocused.current?.focus();
  }, [adding, todos.length, errorMessage]);

  useEffect(() => {
    inputFocused.current?.focus();
  }, []);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          disabled={adding}
          ref={inputFocused}
          data-cy="NewTodoField"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
