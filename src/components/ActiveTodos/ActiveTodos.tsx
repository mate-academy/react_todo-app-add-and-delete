import React from 'react';

type Props = {
  activeItems: number;
};

export const ActiveTodos: React.FC<Props> = ({ activeItems }) => {
  return (
    <span className="todo-count" data-cy="todosCounter">
      {`${activeItems} items left`}
    </span>
  );
};
