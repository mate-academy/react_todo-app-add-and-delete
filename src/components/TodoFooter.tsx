import { Filter } from '../types/filter';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  setSelectedFilter: (filter: Filter) => void;
  selectedFilter: Filter;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  onDelete,
  setSelectedFilter,
  selectedFilter,
}) => {
  const hasNoCompletedTodos = !todos.some(todo => todo.completed);

  async function deleteCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => onDelete(todo.id)));
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={hasNoCompletedTodos}
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
