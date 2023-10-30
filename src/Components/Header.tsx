import { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  onSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void,
  title: string,
  setTitle: (t: string) => void,
  isDisabled: boolean,
}

export const Header: React.FC<Props> = ({
  todos,
  onSubmitForm,
  title,
  setTitle,
  isDisabled,
}) => {
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [isDisabled, todos.length]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          disabled={isDisabled}
        />
      )}
      <form
        method="Post"
        onSubmit={onSubmitForm}
      >
        <input
          data-cy="NewTodoField"
          ref={inputField}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
