import React from 'react';
import { TodoCounter } from '../TodoCounter/TodoCounter';
import { TodoFilter } from '../TodoFilter/TodoFilter';
import { TodoClearButton } from '../TodoClearButton/TodoClearButton';

type Props = {
  changeQuery: (query: string) => void,
  active: number,
  completed: boolean,
};

export const TodoFooter: React.FC<Props> = ({
  changeQuery, active, completed,
}) => {
  return (
    <footer className="todoapp__footer">
      <TodoCounter active={active} />
      <TodoFilter changeQuery={changeQuery} />
      <TodoClearButton completed={completed} />
    </footer>
  );
};
