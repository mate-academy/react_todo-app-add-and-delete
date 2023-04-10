import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { SortType } from '../types/SortType';
import { url } from './url';

export const Footer: React.FC<{
  askTodos: (url: string) => void
  deleteCompleted: () => void
  todosFromServer: Todo[] | undefined
  countComplited: boolean | undefined;
}> = ({
  askTodos,
  deleteCompleted,
  todosFromServer,
  countComplited,
}) => {
  const [selectedForm, setSelectedForm] = useState(SortType.All);

  const sortTodos = (format: SortType) => {
    switch (format) {
      case SortType.Active:
        askTodos(`${url}&completed=false`);
        setSelectedForm(SortType.Active);
        break;
      case SortType.Completed:
        askTodos(`${url}&completed=true`);
        setSelectedForm(SortType.Completed);
        break;

      case SortType.All:
      default:
        askTodos(url);
        setSelectedForm(SortType.All);
        break;
    }
  };

  const onFilterChange = (filter: SortType) => () => {
    sortTodos(filter);
  };

  return (
    <>
      <span className="todo-count">
        {`${todosFromServer?.length || 0} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link', {
              selected: selectedForm === SortType.All,
            },
          )}
          onClick={onFilterChange(SortType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link', {
              selected: selectedForm === SortType.Active,
            },
          )}
          onClick={onFilterChange(SortType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link', {
              selected: selectedForm === SortType.Completed,
            },
          )}
          onClick={onFilterChange(SortType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompleted}
        hidden={!countComplited}
      >
        Clear completed
      </button>
    </>
  );
};
