import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterOptions } from '../../types/FilterOptions';

type Props = {
  todos: Todo[];
  selectedOption: FilterOptions;
  deleteCompletedTodos: () => void;
  selectOption: (option: FilterOptions) => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  selectedOption,
  deleteCompletedTodos,
  selectOption,
}) => {
  const howManyTodosIsActive = todos.filter(
    todo => todo.completed === false,
  ).length;
  const completedClearButtonIsActive = todos.some(
    todo => todo.completed === true,
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${howManyTodosIsActive} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedOption === FilterOptions.FilterByAllButton,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            selectOption(FilterOptions.FilterByAllButton);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedOption === FilterOptions.FilterByActiveTodos,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            selectOption(FilterOptions.FilterByActiveTodos);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedOption === FilterOptions.FilterByCompletedTodos,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            selectOption(FilterOptions.FilterByCompletedTodos);
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompletedTodos}
        disabled={!completedClearButtonIsActive}
      >
        Clear completed
      </button>
    </footer>
  );
};
