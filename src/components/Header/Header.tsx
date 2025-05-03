import React, { FormEvent, useEffect } from 'react';

interface Props {
  activeTodosCount: number;
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  onAddTodo: (title: string) => void;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  activeTodosCount,
  newTodoTitle,
  setNewTodoTitle,
  onAddTodo,
  isInputDisabled,
  inputRef,
}) => {
  // const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !isInputDisabled) {
      inputRef.current.focus();
    }
  }, [isInputDisabled]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onAddTodo(newTodoTitle);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${activeTodosCount === 0 ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isInputDisabled}
          autoFocus
        />
      </form>
    </header>
  );
};
