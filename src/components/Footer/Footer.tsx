import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosFilter } from '../../types/TodosFilter_Enum';

type Props = {
  todos: Todo[],
  filterTodos: TodosFilter,
  handleFilterTodos: (filterValue: TodosFilter) => void,
  handleDeleteCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  filterTodos,
  handleFilterTodos,
  handleDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: filterTodos === TodosFilter.All,
            },
          )}
          onClick={() => handleFilterTodos(TodosFilter.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: filterTodos === TodosFilter.Active,
            },
          )}
          onClick={() => handleFilterTodos(TodosFilter.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: filterTodos === TodosFilter.Completed,
            },
          )}
          onClick={() => handleFilterTodos(TodosFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => handleDeleteCompleted()}
        disabled={todos.every((todo) => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
