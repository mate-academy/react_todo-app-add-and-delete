import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  activeTodos: number | 0;
  filter: Filter;
  handleNewFilterMode: (mode: Filter) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  activeTodos,
  filter,
  handleNewFilterMode,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link${filter === 'all' ? ' selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => handleNewFilterMode('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link${filter === 'active' ? ' selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => handleNewFilterMode('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link${filter === 'completed' ? ' selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => handleNewFilterMode('completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
