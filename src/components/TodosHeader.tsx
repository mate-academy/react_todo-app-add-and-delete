import React, { memo } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  onAddNewTodo: (event: React.FormEvent) => void;
  isAdded: boolean;
};

export const TodosHeader: React.FC<Props> = memo((props) => {
  const {
    newTodoField,
    newTodoTitle,
    setNewTodoTitle,
    onAddNewTodo,
    isAdded,
  } = props;

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={onAddNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(title) => setNewTodoTitle(title.target.value)}
          disabled={isAdded}
        />
      </form>
    </header>
  );
});
