import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[],
  setFilter: React.Dispatch<React.SetStateAction<Filter>>,
  onClear: (todoId: number) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  setFilter,
  onClear,
}) => {
  const [selectedLink, setSelectedLink] = useState<string | null>('All');

  const handleChange = (filterType: Filter) => (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    const selectedLinkText = event.currentTarget.textContent;

    setSelectedLink(selectedLinkText);
    setFilter(filterType);
  };

  const countItemsLeft = useMemo(() => {
    const count = [...todos]
      .filter(todo => !todo.completed).length;

    return count;
  }, [todos]);

  // const completedItems = todos.some(todo => todo.completed);

  const completedItems = todos.filter(todo => todo.completed);

  const handleClear = () => {
    completedItems.forEach(todo => onClear(todo.id));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countItemsLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedLink === 'All',
          })}
          onClick={(event) => handleChange(Filter.All)(event)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedLink === 'Active',
          })}
          onClick={(event) => handleChange(Filter.Active)(event)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedLink === 'Completed',
          })}
          onClick={(event) => handleChange(Filter.Completed)(event)}
        >
          Completed
        </a>
      </nav>

      {completedItems.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClear}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
