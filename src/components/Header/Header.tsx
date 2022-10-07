import React, {
  ChangeEvent, FormEvent, RefObject, useCallback,
} from 'react';

type Props = {
  newTodoField: RefObject<HTMLInputElement>;
  createTodo: (param: FormEvent) => Promise<void>;
  title: string;
  setTitle: (param: string) => void;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  createTodo,
  title,
  setTitle,
}) => {
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }, [title]);

  return (
    <header className="todoapp__header">
      <button
        aria-label="button"
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={createTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
