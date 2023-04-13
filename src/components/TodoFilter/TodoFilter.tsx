import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { SortTodoBy } from '../../types';
import { Todo } from '../../types/Todo';

type Props = {
  onRemoveTodos: () => void;
  todos: Todo[];
  changeTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  sortBy: SortTodoBy;
  changeSortBy: Dispatch<SetStateAction<SortTodoBy>>;
  count: number;
  completedTodo: Todo[];
};

export const TodoFilter: React.FC<Props> = (props) => {
  const {
    onRemoveTodos,
    sortBy,
    changeSortBy,
    count,
    completedTodo,
  } = props;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${count} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: sortBy === SortTodoBy.Default },
          )}
          onClick={() => changeSortBy(SortTodoBy.Default)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: sortBy === SortTodoBy.Active },
          )}
          onClick={() => changeSortBy(SortTodoBy.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: sortBy === SortTodoBy.Completed },
          )}
          onClick={() => changeSortBy(SortTodoBy.Completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodo.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onRemoveTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
