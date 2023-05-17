import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Sort } from '../../utils/enums';

interface Props {
  todos: Todo[];
  filter: Sort;
  setSort: (sort: Sort) => void;
  onDelete: (todoId: number) => void;
}

export const Footer:FC<Props> = ({
  todos,
  filter,
  setSort,
  onDelete,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: filter === 'All' })}
          onClick={() => setSort(Sort.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: filter === 'Active' })}
          onClick={() => setSort(Sort.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: filter === 'Completed' })}
          onClick={() => setSort(Sort.Completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => completedTodos.map(todo => onDelete(todo.id))}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
