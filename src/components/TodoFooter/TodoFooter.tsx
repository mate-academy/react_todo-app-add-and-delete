import React from 'react';
import { TodoFilter } from './TodoFilter/TodoFilter';
import { TodoCounter } from './TodoCounter';
import { TodoClearButton } from './TodoClearButton';

type Props = {
  handleClear: () => void;
  active: number,
  completed: number,
};

export const TodoFooter: React.FC<Props> = ({
  handleClear,
  completed,
  active,
}) => {
  return (
    <footer className="todoapp__footer">
      <TodoCounter active={active} />
      <TodoFilter />
      <TodoClearButton
        completed={completed}
        handleClear={handleClear}
      />
    </footer>
  );
};
