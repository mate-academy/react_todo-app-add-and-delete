import React from 'react';
import { Form } from './Form';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
  newTitle: string;
  onSubmit: (event: React.FormEvent) => void;
  onTitleChange: (title: string) => void;
};

export const Header: React.FC<Props> = ({
  inputRef,
  isAdding,
  newTitle,
  onSubmit,
  onTitleChange,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <Form
        inputRef={inputRef}
        isAdding={isAdding}
        newTitle={newTitle}
        onSubmit={onSubmit}
        onTitleChange={onTitleChange}
      />
    </header>
  );
};
