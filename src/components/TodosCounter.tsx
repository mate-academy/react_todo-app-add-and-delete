// src/components/TodosCounter.tsx
import React from 'react';

interface Props {
  count: number;
}

export const TodosCounter: React.FC<Props> = ({ count }) => {
  return (
    <span className="todoapp__items-left" data-cy="TodosCounter">
      {count} items left
    </span>
  );
};
