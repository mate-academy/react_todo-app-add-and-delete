import classNames from 'classnames';

import { ClearCompleted } from '../ClearCompleted/ClearCompleted';

import { Filter } from '../../enums/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filterValue: Filter;
  onCompleted: () => void;
  onAll: () => void;
  onActive: () => void;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterValue,
  onCompleted,
  onAll,
  onActive,
  clearCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${todos.length} items left`}
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterValue === Filter.All,
        })}
        onClick={onAll}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterValue === Filter.Active,
        })}
        onClick={onActive}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterValue === Filter.Completed,
        })}
        onClick={onCompleted}
      >
        Completed
      </a>
    </nav>

    <ClearCompleted todos={todos} clearCompleted={clearCompleted} />
  </footer>
);
