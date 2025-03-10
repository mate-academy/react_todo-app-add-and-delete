/* eslint-disable @typescript-eslint/indent */
import { Todo } from '../types/Todo';
import { FilterType } from '../types/enum';

interface PropsFooter {
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  filter: FilterType;
  todos: Todo[];
  handleClearCompleted: () => void;
}

export const TodoFooter: React.FC<PropsFooter> = ({
  setFilter,
  filter,
  todos,
  handleClearCompleted,
}) => {
  const disabledTodos = !todos.some(todo => todo.completed);

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todos.filter(todo => !todo.completed).length} items left
          </span>
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={`filter__link ${filter === FilterType.All ? 'selected' : ''}`}
              data-cy="FilterLinkAll"
              onClick={() => setFilter(FilterType.All)}
            >
              All
            </a>
            <a
              href="#/active"
              className={`filter__link ${filter === FilterType.Active ? 'selected' : ''}`}
              data-cy="FilterLinkActive"
              onClick={() => setFilter(FilterType.Active)}
            >
              Active
            </a>
            <a
              href="#/completed"
              className={`filter__link ${filter === FilterType.Completed ? 'selected' : ''}`}
              data-cy="FilterLinkCompleted"
              onClick={() => setFilter(FilterType.Completed)}
            >
              Completed
            </a>
          </nav>
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={disabledTodos}
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
