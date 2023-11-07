/* eslint-disable max-len */
import React from 'react';
import { TodoForm } from './todoForm/TodoForm';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  onAdd: (val: string) => void,
  setTitle: (val: string) => void,
  title: string,
  isSubmitting: boolean,
};

export const Header: React.FC<Props> = ({
  onAdd,
  setTitle,
  title,
  isSubmitting,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <TodoForm onAdd={onAdd} setTitle={setTitle} title={title} isSubmitting={isSubmitting} />
    </header>
  );
};
