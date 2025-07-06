import classNames from 'classnames';
import { SetStateAction } from 'react';
import { Filter } from '../../types/Filter';

type Props = {
  filterName: string;
  countOfCompletedTodos: () => number;
  setFilterName: React.Dispatch<SetStateAction<Filter>>;
  countOfNotCompletedTodos: () => number;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterName,
  countOfCompletedTodos,
  setFilterName,
  countOfNotCompletedTodos,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countOfNotCompletedTodos()} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterOption => (
          <a
            key={filterOption}
            href={`#/${filterOption}`}
            className={classNames('filter__link', {
              selected: filterName === filterOption,
            })}
            data-cy={`FilterLink${filterOption}`}
            onClick={() => {
              setFilterName(filterOption);
            }}
          >
            {filterOption}
          </a>
        ))}
      </nav>

      <button
        type="button"
        disabled={countOfCompletedTodos() <= 0}
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
