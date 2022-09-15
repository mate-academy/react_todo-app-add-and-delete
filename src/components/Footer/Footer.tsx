import classNames from 'classnames';
import { FilterOption } from '../../types/FilterOption';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  deleteCompleted: () => void;
  filterTodos: (event: FilterOption) => void,
  filterOption: FilterOption;
  isAdding: boolean;
};

export const Footer: React.FC<Props> = (
  {
    todos,
    deleteCompleted,
    filterTodos,
    filterOption,
    isAdding,
  },
) => {
  return (
    <>
      {(todos.length > 0 || isAdding) && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${todos.filter(todo => !todo.completed).length} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className={classNames(
                'filter__link',
                {
                  selected: filterOption === FilterOption.all,
                },
              )}
              onClick={() => filterTodos(FilterOption.all)}
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className={classNames(
                'filter__link',
                {
                  selected: filterOption === FilterOption.active,
                },
              )}
              onClick={() => filterTodos(FilterOption.active)}
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className={classNames(
                'filter__link',
                {
                  selected: filterOption === FilterOption.completed,
                },
              )}
              onClick={() => filterTodos(FilterOption.completed)}
            >
              Completed
            </a>
          </nav>

          <button
            data-cy="ClearCompletedButton"
            type="button"
            className={classNames(
              'todoapp__clear-completed',
              {
                'is-invisible': todos.every(todo => !todo.completed),
              },
            )}
            onClick={() => deleteCompleted()}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
