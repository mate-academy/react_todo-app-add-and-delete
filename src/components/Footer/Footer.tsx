import classNames from 'classnames';

type Props = {
  noCompleteTodos: boolean,
  filterBy: string,
  setFilterBy: (value: string) => void,
  clearCompleted: () => void
};

const navigation = ['All', 'Active', 'Completed'];

export const Footer: React.FC<Props> = ({
  noCompleteTodos,
  filterBy,
  setFilterBy,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        3 items left
      </span>

      <nav className="filter">

        {navigation.map((nav) => {
          return (
            <a
              key={nav}
              href="#/"
              className={classNames(
                'filter__link',
                { selected: filterBy === nav },
              )}
              onClick={() => setFilterBy(nav)}
            >
              {nav}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'todoapp__clear-completed_none': !noCompleteTodos },

        )}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
