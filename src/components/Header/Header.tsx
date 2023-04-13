import React from 'react';

import { NewTodoForm } from '../TodoForm/TodoForm';

export const Header: React.FC = () => (
  <header className="todoapp__header">
    <button
      aria-label="Toggle"
      type="button"
      className="todoapp__toggle-all"
    />

    <NewTodoForm />
  </header>
);
