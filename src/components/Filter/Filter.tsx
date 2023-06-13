import classNames from 'classnames';
import { FilterEnum } from '../../types/FilterEnum';

interface FilterProps {
  handleFilter: (value: FilterEnum) => void,
  onClearCompleted: () => void,
  activeFilter: FilterEnum,
  completedTodo: number,
  activeTodo: number,
}

export const Filter: React.FC<FilterProps> = ({
  handleFilter,
  onClearCompleted,
  activeFilter,
  completedTodo,
  activeTodo,
}) => {
  const filterOptions = [
    FilterEnum.All,
    FilterEnum.Active,
    FilterEnum.Completed,
  ];

  return (
    <>
      <span className="todo-count">
        {`${activeTodo} items left`}
      </span>
      <nav className="filter">
        {filterOptions.map((option) => (
          <a
            key={option}
            href={`#/${option}`}
            className={classNames('filter__link', {
              selected: activeFilter === option,
            })}
            onClick={() => handleFilter(option)}
          >
            {option}
          </a>
        ))}

      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearCompleted}
      >
        {completedTodo > 0 && ('Clear completed')}
      </button>
    </>
  );
};
