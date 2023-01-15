import React from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>
  todosLength: number,
  newTodoTitle: string,
  setNewTodoTitle: (value: string) => void,
  handlesSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  isAdding: boolean,
}

export const TodoAppHeader: React.FC<Props> = ({
  newTodoField,
  todosLength,
  newTodoTitle,
  setNewTodoTitle,
  handlesSubmit,
  isAdding,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setNewTodoTitle(value);
  };

  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
          aria-label="Mute volume"
        />
      )}

      <form onSubmit={handlesSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
