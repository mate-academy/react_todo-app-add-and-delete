import React from 'react';

export type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  query: string,
  onInputChange(str: string): void,
  onFormSubmit(event: React.FormEvent<HTMLFormElement>): void,
  isAdding: boolean,
};

export const NewTodoField: React.FC<Props> = ({
  newTodoField,
  query,
  onInputChange,
  onFormSubmit,
  isAdding,
}) => {
  return (
    <form onSubmit={onFormSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(ev) => onInputChange(ev.target.value)}
        disabled={isAdding}
      />
    </form>
  );
};
