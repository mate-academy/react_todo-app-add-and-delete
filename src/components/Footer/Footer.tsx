import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  status: 'all' | 'active' | 'completed';
  onChangeStatus: (status: Filter) => void;
  onClearCompleted: () => void;
};

const nameStatus: Record<Filter, string> = {
  [Filter.All]: 'All',
  [Filter.Active]: 'Active',
  [Filter.Completed]: 'Completed',
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  onChangeStatus,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(value => (
          <a
            key={value}
            href="#/"
            className={classNames('filter__link', {
              selected: status === value,
            })}
            onClick={() => onChangeStatus(value)}
            data-cy={`FilterLink${nameStatus[value]}`}
          >
            {nameStatus[value]}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={todos.every(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
