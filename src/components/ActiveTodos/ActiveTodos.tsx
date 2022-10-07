import React from 'react';

type Props = {
  activeItems: number;
};

export const ActiveTodos: React.FC<Props> = ({ activeItems }) => (
  <span className="todo-count" data-cy="todosCounter">
    {`${activeItems} items left`}
  </span>
);
