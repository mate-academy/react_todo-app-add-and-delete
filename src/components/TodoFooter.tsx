import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { FilterOptions } from '../types/FilterOptions';

interface TodoFooterProps {
  todos: Todo[];
  onFilter: (option: FilterOptions) => void;
  onDeleteCompletedTodo: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  onFilter,
  onDeleteCompletedTodo,
}) => {
  const [option, setOption] = useState(FilterOptions.All);
  const countActiveTodo = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodo = todos.some(todo => todo.completed);

  const handleFilterSelect = (
    filter: FilterOptions,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    setOption(filter);
  };

  useEffect(() => {
    onFilter(option);
  }, [option, onFilter]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countActiveTodo} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterOptions).map(filterOption => (
          <a
            key={filterOption}
            href={`#/${filterOption.toLowerCase()}`}
            role="button"
            aria-pressed={option === filterOption}
            className={classNames('filter__link', {
              selected: option === filterOption,
            })}
            data-cy={`FilterLink${filterOption}`}
            onClick={e => handleFilterSelect(filterOption, e)}
          >
            {filterOption}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodo}
        onClick={onDeleteCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
