import React, { FormEvent, RefObject, useEffect } from 'react';

type Props = {
  newTodoField: RefObject<HTMLInputElement>,
  addNewTodo: (event: FormEvent) => Promise<void>,
  title: string,
  setTitle: (param: string) => void,
};

export const Header: React.FC<Props> = ({
  newTodoField,
  addNewTodo,
  title,
  setTitle,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        aria-label="button"
        className="todoapp__toggle-all active"
      />
      <form
        onSubmit={addNewTodo}
      >
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
