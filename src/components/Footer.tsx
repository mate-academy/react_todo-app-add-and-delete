import React from 'react';
import { Filters } from './Filters';
import { TodoCount } from './TodoCount';
import { ClearButton } from './ClearButton';

export const Footer: React.FC = () => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <TodoCount />

      <Filters />

      <ClearButton />
    </footer>
  );
};
