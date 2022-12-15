import classNames from 'classnames';
import { removeTodo } from '../api/todos';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  activeTodos: Todo[],
  filterBy: Filter,
  selectFilterField: (filter: Filter) => void,
  completedTodosId: number[],
  onSetTodosToRemove: (idToRemove: number) => void,
  loadTodos: () => void,
};

export const Footer: React.FC<Props> = (
  {
    activeTodos,
    filterBy,
    selectFilterField,
    completedTodosId,
    onSetTodosToRemove,
    loadTodos,
  },
) => {
  const onClearCompleted = () => {
    completedTodosId.map(async id => {
      onSetTodosToRemove(id);
      await removeTodo(id);
    });

    loadTodos();
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === Filter.ALL,
          })}
          onClick={() => selectFilterField(Filter.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === Filter.ACTIVE,
          })}
          onClick={() => selectFilterField(Filter.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === Filter.COMPLETED,
          })}
          onClick={() => selectFilterField(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: completedTodosId.length === 0,
        })}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
