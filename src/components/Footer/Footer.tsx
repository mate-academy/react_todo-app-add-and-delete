import classNames from 'classnames';
import { FilterOption } from '../../types/FilterOption';
import { Todo } from '../../types/Todo';
import './Footer.scss';

type Props = {
  activeTodos: Todo[];
  filterOption: FilterOption;
  setFilterOption: (option: FilterOption) => void;
  isClearBtn: boolean;
  deleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  filterOption,
  setFilterOption,
  isClearBtn,
  deleteCompletedTodos,
}) => {
  const filterOptionArr = Object.values(FilterOption);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        {filterOptionArr.map(option => {
          let href = '#/';

          if (option !== FilterOption.ALL) {
            href += option.toLowerCase();
          }

          return (
            <a
              href={href}
              className={classNames('filter__link',
                { selected: filterOption === option })}
              onClick={() => setFilterOption(option)}
            >
              {option}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'clear-button': !isClearBtn },
        )}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
