import { useEffect } from 'react';

interface Props {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  newTodoFieldRef: React.RefObject<HTMLInputElement>;
  isAllCompleted: boolean;
  handleSelectAll: () => void;
  hasTodos: boolean;
  isSubmitting: boolean; // <-- Додайте сюди
}

export const Header: React.FC<Props> = ({
  inputValue,
  setInputValue,
  handleSubmit,
  newTodoFieldRef,
  isAllCompleted,
  handleSelectAll,
  hasTodos,
  isSubmitting,
}) => {
  useEffect(() => {
    newTodoFieldRef.current?.focus();
  }, [newTodoFieldRef]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={`todoapp__toggle-all ${isAllCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleSelectAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          ref={newTodoFieldRef}
          disabled={isSubmitting}
          autoFocus
        />
      </form>
    </header>
  );
};
