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
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => todo.completed === false).length} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedOption === -1,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            selectOption(-1);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedOption === false,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            selectOption(false);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedOption === true,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            selectOption(true);
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
        disabled={!todos.some(todo => todo.completed === true)}
      >
        Clear completed
      </button>
    </footer>
  );
};
