import React from 'react';

import Filters from '../../Filters';
import ClearButton from '../ClearButton';
import TodosCounter from '../TodosCounter';

export const Footer: React.FC = () => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <TodosCounter />

      <Filters />

      <ClearButton />
    </footer>
  );
};
