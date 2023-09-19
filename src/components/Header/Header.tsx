/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-cycle */
import React from 'react';
import { AddTodoForm } from '../AddTodoForm/AddTodoForm';

export const Header: React.FC = () => {
  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />

      {/* Add a todo on form submit */}
      <AddTodoForm />
    </header>
  );
};
