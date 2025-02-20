import React from 'react';

import './Footer.scss';

import { Todo } from '../../types/Todo';
import { Filter } from '../Filter';
import { FilterType } from '../../types/FilterType';

type Props = {
  todos: Todo[];
  filterType: FilterType;
  onFilterType: (filterType: FilterType) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  onFilterType = () => { },
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <Filter filterType={filterType} onFilterType={onFilterType} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
