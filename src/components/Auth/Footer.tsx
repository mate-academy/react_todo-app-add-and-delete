import { Navigation } from './Navigation';
import { Filter } from '../../types/Filter';

type Props = {
  filter: Filter;
  setFilter: (arg: Filter) => void;
};

export const Footer: React.FC<Props> = ({ filter, setFilter }) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      4 items left
    </span>

    <Navigation filter={filter} setFilter={setFilter} />

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
    >
      Clear completed
    </button>
  </footer>
);
