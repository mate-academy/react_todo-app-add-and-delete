/* eslint-disable @typescript-eslint/no-unused-expressions */
import classNames from 'classnames';
import { SortType } from '../../types/SortType';
import { Todo } from '../../types/Todo';
import './TodoFooter.scss';

type Props = {
  sortType: SortType,
  setSortType: (value: SortType) => void,
  todos: Todo[],
  completedTodosIds: number [],
  handlerClearCompletedButton: () => void,
};

export const TodoFooter: React.FC<Props> = ({
  setSortType,
  todos,
  completedTodosIds,
  sortType,
  handlerClearCompletedButton,
}) => {
  const todosLength = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: sortType === SortType.ALL },
          )}
          onClick={() => {
            setSortType(SortType.ALL);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: sortType === SortType.ACTIVE },
          )}
          onClick={() => {
            setSortType(SortType.ACTIVE);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: sortType === SortType.COMPLETED },
          )}
          onClick={() => {
            setSortType(SortType.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { disabled: completedTodosIds.length === 0 },
        )}
        onClick={handlerClearCompletedButton}
      >
        Clear completed
      </button>

    </footer>
  );
};
