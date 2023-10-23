import { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  title: string,
  setTitle: (val: string) => void;
  onHandleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  statusResponce: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  title,
  setTitle,
  onHandleSubmit,
  statusResponce,
}) => {
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [statusResponce, todos.length]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0  && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          disabled={statusResponce}
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
          disabled={statusResponce}
        />
      </form>
    </header>
  );
};
