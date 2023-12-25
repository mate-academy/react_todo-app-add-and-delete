import React, { useContext } from 'react';
import { TodosContext } from '../../contexts/TodosContext';

export const TodosCounter: React.FC = () => {
  const { activeTodos } = useContext(TodosContext);

  return (
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodos.length}
      {' '}
      items left
    </span>
  );
};
