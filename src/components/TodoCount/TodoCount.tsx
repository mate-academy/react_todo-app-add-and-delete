import React from 'react';

interface Props {
  todosLeft: number;
}

export const TodoCount: React.FC<Props> = ({ todosLeft }) => {
  return (
    <span className="todo-count" data-cy="todosCounter">
      {`${todosLeft} items left`}
    </span>
  );
};
