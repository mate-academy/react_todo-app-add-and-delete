import classNames from 'classnames';
import { FilterTerm } from '../App';

interface Props {
  leftItems: number;
  handleClearCompletedTodos: () => void;
  hasCompletedTodos: boolean;
  handleFiltered: (arg0: string) => void;
  filterTerm: string;
}

interface Button {
  dataCy: string;
  label: string;
  action: () => void;
}

const Footer: React.FC<Props> = ({
  leftItems,
  handleClearCompletedTodos,
  hasCompletedTodos,
  handleFiltered,
  filterTerm,
}) => {
  const buttons: Button[] = [
    {
      dataCy: 'FilterLinkAll',
      label: 'All',
      action: () => handleFiltered(FilterTerm.All),
    },
    {
      dataCy: 'FilterLinkActive',
      label: 'Active',
      action: () => handleFiltered(FilterTerm.Active),
    },
    {
      dataCy: 'FilterLinkCompleted',
      label: 'Completed',
      action: () => handleFiltered(FilterTerm.Completed),
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {leftItems} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {buttons.map(button => (
          <a
            key={button.label}
            href="#/"
            className={classNames('filter__link', {
              selected: filterTerm === button.label,
            })}
            data-cy={button.dataCy}
            onClick={button.action}
          >
            {button.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        disabled={!hasCompletedTodos}
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
