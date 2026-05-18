import { FilterKeys } from '../types/filters';
import { Todo } from '../types/Todo';

export const AppFooter = ({
  todos,
  filter,
  setFilter,
  onClearCompleted,
  isCompletedTodos,
}: {
  todos: Todo[];
  filter: FilterKeys;
  setFilter: (val: FilterKeys) => void;
  onClearCompleted: () => void;
  isCompletedTodos?: boolean;
}) => {
  const completedTodos = todos?.filter(todo => !todo.completed).length;
  const filterKeys = Object.keys(FilterKeys) as Array<keyof typeof FilterKeys>;

  return (
    <footer
      className={`todoapp__footer ${!todos?.length ? 'hidden' : ''}`}
      data-cy="Footer"
    >
      <span className="todo-count" data-cy="TodosCounter">
        {`${completedTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterKeys.map(value => (
          <a
            key={value}
            href="#/"
            className={`filter__link ${filter === FilterKeys[value] ? 'selected' : ''}`}
            data-cy={`FilterLink${FilterKeys[value]}`}
            onClick={() => setFilter(FilterKeys[value])}
          >
            {FilterKeys[value]}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
