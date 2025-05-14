import React from 'react';

interface TodoCounterProps {
  count: number;
}

export const TodoCounter: React.FC<TodoCounterProps> = ({ count }) => {
  return (
    <span className="todo-count" data-cy="TodosCounter">
      {`${count} ${count === 1 ? 'item' : 'items'} left`}
    </span>
  );
};
