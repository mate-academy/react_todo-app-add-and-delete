/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  title: string,
  setTitle: (val: string) => void;
  onHandleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  response: boolean;
};

export const Header: FC<Props> = ({
  todos,
  title,
  setTitle,
  onHandleSubmit,
  response,
}) => {
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [response, todos.length]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          disabled={response}
        />
      )}

      <form
        method="post"
        onSubmit={onHandleSubmit}
      >
        <input
          data-cy="NewTodoField"
          ref={inputField}
          value={title}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setTitle(e.target.value)}
          disabled={response}
        />
      </form>
    </header>
  );
};
