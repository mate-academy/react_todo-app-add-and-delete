import { Todo } from '../types/Todo';

interface FilterProps {
  todosLeftCounter: number,
  handleFilterChange: (value: string) => void,
  filter: string,
  handleRemoveCompleted: () => void,
  completedTodos: Todo[],
}

export const Filter: React.FC<FilterProps> = ({
  todosLeftCounter,
  handleFilterChange,
  filter,
  handleRemoveCompleted,
  completedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosLeftCounter} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={`filter__link ${filter === 'All' && 'selected'}`}
          onClick={() => handleFilterChange('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === 'Active' && 'selected'}`}
          onClick={() => handleFilterChange('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === 'Completed' && 'selected'}`}
          onClick={() => handleFilterChange('Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleRemoveCompleted}
      >
        {completedTodos.length > 0 && ('Clear completed')}
      </button>
    </footer>
  );
};
