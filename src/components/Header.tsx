import { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  isDisable: boolean,
  onHandleSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  title: string,
  setTitle: (title: string) => void,
  todos: Todo[]
};

export const Header: React.FC<Props> = ({
  isDisable,
  onHandleSubmit,
  title,
  setTitle,
  todos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisable, todos.length]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          aria-label="toggle all active"
          data-cy="ToggleAllButton"
          disabled={isDisable}
        />
      )}

      <form onSubmit={onHandleSubmit}>
        <input
          disabled={isDisable}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
