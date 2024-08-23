import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { errorMessages, ErrorMessages } from '../../types/ErrorMessages';
import { deleteTodo } from '../../api/todos';

const filterDataAtributes = {
  [Filter.all]: 'FilterLinkAll',
  [Filter.active]: 'FilterLinkActive',
  [Filter.completed]: 'FilterLinkCompleted',
};

type Props = {
  onSetFilter: (filter: Filter) => void;
  activeListLength?: number;
  currentFilter: Filter;
  completedTodos: Todo[];
  onHandleDeleteTodo: (deleteTodoIds: number[]) => void;
  onSetError: (errorMessage: ErrorMessages) => void;
};

export const Footer: React.FC<Props> = ({
  onSetFilter,
  activeListLength,
  currentFilter,
  completedTodos,
  onHandleDeleteTodo,
  onSetError,
}) => {
  function handleFilter(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const newFilter = event.currentTarget.textContent as Filter;

    onSetFilter(newFilter);
  }

  function handleDeleteComplitedTodo() {
    const completedTodosIds = completedTodos.map(({ id }) => id);
    const promiseMap = completedTodosIds.map(deleteTodo);

    Promise.allSettled(promiseMap).then(results => {
      const successDeletedIds: number[] = [];
      let isDeleteError = false;

      results.forEach((result, ind) => {
        if (result.status === 'fulfilled') {
          successDeletedIds.push(completedTodosIds[ind]);
        }

        if (result.status == 'rejected') {
          isDeleteError = true;
        }
      });

      if (successDeletedIds.length > 0) {
        onHandleDeleteTodo(successDeletedIds);
      }

      if (isDeleteError) {
        onSetError(errorMessages.delete);
      }
    });
  }

  const filterList = Object.entries(Filter);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeListLength} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterList.map(([filterKey, filterValue]) => (
          <a
            key={filterKey}
            href={filterKey === 'all' ? '#/' : `#/${filterKey}`}
            className={cn('filter__link', {
              selected: currentFilter === filterValue,
            })}
            data-cy={filterDataAtributes[filterValue]}
            onClick={handleFilter}
          >
            {filterValue}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={handleDeleteComplitedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
