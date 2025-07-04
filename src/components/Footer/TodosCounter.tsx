import React from 'react';

type TodosCounterProps = {
  count: number;
};

export const TodosCounter: React.FC<TodosCounterProps> = ({ count }) => {
  return (
    <span className="todo-count" data-cy="TodosCounter">
      {count} items left
    </span>
  );
};
