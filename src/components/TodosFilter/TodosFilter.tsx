import { useEffect, useState } from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  usersTodos: Todo[];
  onFilter: (filteredTodos: Todo[]) => void
  onDeleteCompleted: (ids: number[] | number, status: boolean) => void
  onError: (error: ErrorType) => void
};

export const TodosFilter: React.FC<Props> = ({
  usersTodos,
  onFilter,
  onDeleteCompleted,
  onError,
}) => {
  const [filterType, setFilterType] = useState<FilterType>(FilterType.NONE);

  useEffect(() => {
    switch (filterType) {
      case FilterType.COMPLETED:
        onFilter(usersTodos
          .filter(todo => todo.completed));
        break;

      case FilterType.ACTIVE:
        onFilter(usersTodos
          .filter(todo => !todo.completed));
        break;

      default:
        onFilter(usersTodos);
        break;
    }
  }, [filterType]);

  const completedTodos = usersTodos
    .filter(item => item.completed === true)
    .map(item => item.id);

  const clearCompleted = () => {
    onDeleteCompleted(completedTodos, true);
    Promise.all(completedTodos.map(id => deleteTodo(id)))
      .catch(() => {
        onError(ErrorType.DELETE);
      })
      .finally(() => {
        onDeleteCompleted(completedTodos, false);
      });
  };

  const uncompletedTodos = usersTodos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: filterType === FilterType.NONE,
          })}
          onClick={() => {
            setFilterType(FilterType.NONE);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: filterType === FilterType.ACTIVE,
          })}
          onClick={() => {
            setFilterType(FilterType.ACTIVE);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: filterType === FilterType.COMPLETED,
          })}
          onClick={() => {
            setFilterType(FilterType.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      {completedTodos.length !== 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
