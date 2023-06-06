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
  return (
    <>
      <span className="todo-count">
        {`${activeTodo} items left`}
      </span>
      <nav className="filter">
        <a
          href={`#/${FilterEnum.All}`}
          className={classNames('filter__link', {
            selected: activeFilter === FilterEnum.All,
          })}
          onClick={() => handleFilter(FilterEnum.All)}
        >
          {FilterEnum.All}
        </a>

        <a
          href={`#/${FilterEnum.Active}`}
          className={classNames('filter__link', {
            selected: activeFilter === FilterEnum.Active,
          })}
          onClick={() => handleFilter(FilterEnum.Active)}
        >
          {FilterEnum.Active}
        </a>

        <a
          href={`#/${FilterEnum.Completed}`}
          className={classNames('filter__link', {
            selected: activeFilter === FilterEnum.Completed,
          })}
          onClick={() => handleFilter(FilterEnum.Completed)}
        >
          {FilterEnum.Completed}
        </a>
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
