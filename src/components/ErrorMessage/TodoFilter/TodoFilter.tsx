import { Dispatch, SetStateAction } from 'react';
import { SortTodoBy } from '../../../types';

type Props = {
  changeSortBy: Dispatch<SetStateAction<SortTodoBy>>;
};

export const TodoFilter: React.FC<Props> = (props) => {
  const { changeSortBy } = props;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        3 items left
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a href="#/" className="filter__link selected">
          All
        </a>

        <a
          href="#/active"
          className="filter__link"
          onClick={() => changeSortBy(SortTodoBy.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className="filter__link"
          onClick={() => changeSortBy(SortTodoBy.Completed)}
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
