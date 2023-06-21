import React from 'react';
import { FilterTypes, TodoFilter } from '../TodoFilter';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  onFilterType: (type: FilterTypes) => void
};

export const Footer: React.FC<Props> = ({
  todos,
  onFilterType,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.length} items left`}
      </span>

      <TodoFilter onFilterType={onFilterType} />

      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
