import React, { FormEventHandler, RefObject } from 'react';

type Props = {
  newTodoField: RefObject<HTMLInputElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  setTitle: (param: string) => void;
  title: string;
};

export const TodoHeader: React.FC<Props> = ({
  newTodoField,
  handleSubmit,
  setTitle,
  title,
}) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="a problem"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
