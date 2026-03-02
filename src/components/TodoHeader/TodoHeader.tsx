import React, { useEffect } from 'react';

type Props = {
  newTodoQuery: string;
  onNewTodoQueryChange: (query: string) => void;
  shouldFocusNewTodo: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onAddTodo: () => void;
  isAdding: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  newTodoQuery,
  onNewTodoQueryChange,
  shouldFocusNewTodo,
  inputRef,
  onAddTodo,
  isAdding,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef, shouldFocusNewTodo]);

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddTodo();
    inputRef.current?.focus();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmitHandler}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoQuery}
          onChange={event => onNewTodoQueryChange(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
