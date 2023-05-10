import cn from 'classnames';

interface Props {
  setFilter: (filter: string) => void;
  selectedFilter: string;
}

export const Footer: React.FC<Props> = ({ setFilter, selectedFilter }) => {
  return (
    <footer className="todoapp__footer">
      {/* Hide the footer if there are no todos */}

      <span className="todo-count">
        3 items left
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            // eslint-disable-next-line quote-props
            'selected': selectedFilter === 'all',
          })}
          onClick={() => {
            setFilter('all');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            // eslint-disable-next-line quote-props
            'selected': selectedFilter === 'active',
          })}
          onClick={() => {
            setFilter('active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            // eslint-disable-next-line quote-props
            'selected': selectedFilter === 'completed',
          })}
          onClick={() => {
            setFilter('completed');
          }}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
