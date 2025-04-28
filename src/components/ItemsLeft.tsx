import React from 'react';

interface Props {
  activeTodos: number;
}

export const ItemsLeft: React.FC<Props> = ({ activeTodos }) => {
  return (
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodos} items left
    </span>
  );
};
