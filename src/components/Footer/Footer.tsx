import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../utils/enums';

interface Props {
  todos: Todo[];
  filter: FilterType;
  onChangeSort: (sort: FilterType) => void;
  onDelete: (todoId: number) => void;
}

export const Footer:FC<Props> = ({
  todos,
  filter,
  onChangeSort,
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
          onClick={() => onChangeSort(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: filter === 'Active' })}
          onClick={() => onChangeSort(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: filter === 'Completed' })}
          onClick={() => onChangeSort(FilterType.Completed)}
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
