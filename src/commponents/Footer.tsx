import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  setFilterStatus: (value: Status) => void;
  filterStatus: string;
  handleClearComleated: () => void;
};

type Status = 'all' | 'active' | 'completed';

export const Footer = ({
  todos,
  setFilterStatus,
  handleClearComleated,
  filterStatus,
}: Props) => {
  const copletedTrue = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filterStatus === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilterStatus('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filterStatus === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilterStatus('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filterStatus === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterStatus('completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!copletedTrue}
        onClick={handleClearComleated}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
