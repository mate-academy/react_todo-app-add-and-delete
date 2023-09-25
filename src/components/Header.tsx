import React from 'react';

type Props = {
  activeTodosCount: number,
  handleSubmit: (event: React.FormEvent) => void,
  loadingId: number[],
  title: string,
  setTitle: (title: string) => void,
  isFormActive: boolean,
};

export const Header: React.FC<Props> = ({
  activeTodosCount,
  handleSubmit,
  loadingId,
  title,
  setTitle,
  isFormActive,

}) => {
  const inputRef = React.useRef<any>();

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    <header className="todoapp__header">
      {activeTodosCount > 0 && (
        <button
          data-cy="ToggleAllButton"
          aria-label="button"
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={loadingId.length > 0 || !isFormActive}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
