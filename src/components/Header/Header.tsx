/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { NewToDoField } from '../NewToDoField';

type Props = {
  newTodoTitle: string;
  onTitleChange: (value: string) => void;
  onToDoAdd: (e: React.FormEvent) => void;
  isAdding: boolean;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  onTitleChange,
  onToDoAdd,
  isAdding,
}) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <NewToDoField
        title={newTodoTitle}
        onTitleChange={onTitleChange}
        onToDoAdd={onToDoAdd}
        isAdding={isAdding}
      />
    </header>
  );
};
