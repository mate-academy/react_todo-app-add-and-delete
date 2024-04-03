import React from 'react';

import { Form } from '../Form/Form';

type Props = {
  newTitle: string;
  setNewTitle: (event: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  onSubmit,
  isInputDisabled,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />
      <Form
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        onSubmit={onSubmit}
        isDisabled={isInputDisabled}
        inputRef={inputRef}
      />
    </header>
  );
};
