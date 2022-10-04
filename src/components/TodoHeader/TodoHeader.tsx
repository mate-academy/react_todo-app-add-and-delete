import React, { ChangeEvent, FormEvent } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  createTodo: (event: FormEvent) => void,
  title: string,
  setTitle: (param: string) => void,
};

export const TodoHeader: React.FC<Props> = ({
  newTodoField,
  createTodo,
  title,
  setTitle,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="active"
      />

      <form onSubmit={createTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
