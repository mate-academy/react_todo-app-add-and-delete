import React from 'react';
import { FilterBy } from '../types/FilterBy';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { hasTodoCompleted } from '../utils/Helpers';

type Props = {
  setfilterBy: React.Dispatch<React.SetStateAction<FilterBy>>;
  filterBy: FilterBy;
  todos: Todo[];
  onDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  setfilterBy,
  filterBy,
  todos,
  onDeleteCompleted,
}) => {
  const links = Object.entries(FilterBy);

  const totalActiveTodos = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {totalActiveTodos} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {links.map(([key, value]) => (
          <a
            href={`#/${value === FilterBy.All ? '' : `${value}`}`}
            className={cn('filter__link', { selected: filterBy === value })}
            data-cy={`FilterLink${key}`}
            key={key}
            onClick={() => setfilterBy(value)}
          >
            {key}
          </a>
        ))}
      </nav>
      <button
        disabled={!hasTodoCompleted(todos)}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
