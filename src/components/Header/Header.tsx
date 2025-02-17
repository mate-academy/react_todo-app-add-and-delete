import React, { Ref } from 'react';

type Props = {
  activeInput: Ref<HTMLInputElement>;
  createNewTodo: () => void;
  titleNew: string;
  setTitleNew: (title: string) => void;
    loadTodo: boolean;
};

export const Header: React.FC<Props> = ({
  activeInput,
  createNewTodo,
  titleNew,
  setTitleNew,
  loadTodo,
}) => {
  const onAddNewTodo = (event: React.FormEvent) => {
    event.preventDefault();

    createNewTodo();
  };

  return (
      <header className="todoapp__header">
        <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
        />
        <form method="POST" onSubmit={onAddNewTodo}>
          <input
              disabled={loadTodo}
              ref={activeInput}
              value={titleNew}
              onChange={event => setTitleNew(event.target.value)}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
          />
        </form>
      </header>
  );
};
