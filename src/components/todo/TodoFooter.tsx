import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterOption } from '../../App';

type Props = {
  todos: Todo[];
  filterOption: FilterOption;
  setFilterOption: (a: FilterOption) => void;
  clearCompleted: () => Promise<void>;
};

const filters = [
  {
    label: 'All',
    value: FilterOption.default,
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    label: 'Active',
    value: FilterOption.Active,
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    label: 'Completed',
    value: FilterOption.Completed,
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterOption,
  setFilterOption,
  clearCompleted,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const hasCompleted = completedTodos.length > 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter.value}
            href={filter.href}
            className={classNames('filter__link', {
              selected: filterOption === filter.value,
            })}
            data-cy={filter.dataCy}
            onClick={() => setFilterOption(filter.value)}
          >
            {filter.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!hasCompleted}
        style={{ visibility: hasCompleted ? 'visible' : 'hidden' }}
      >
        Clear completed
      </button>
    </footer>
  );
};
