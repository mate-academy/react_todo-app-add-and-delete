import React from 'react';

interface Props {
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>; // #FIX: Dodaj typ dla referencji
  isAdding: boolean;
}

export const Header: React.FC<Props> = ({
  title,
  onTitleChange,
  onSubmit,
  inputRef, // #FIX: Odbierz referencję z propsów
  isAdding,
}) => {
  return (
    <header className="todoapp__header">
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef} // #FIX: Przypisz referencję do elementu input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
