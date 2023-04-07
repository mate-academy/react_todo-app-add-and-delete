import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

enum SortType {
  completed,
  active,
  all,
}

export const Footer: React.FC<{
  askTodos: (url: string) => void
  clearCompleted: (status: string) => void
  todosFromServer: Todo[] | undefined
  countComplited: boolean | undefined;
}> = ({
  askTodos,
  clearCompleted,
  todosFromServer,
  countComplited,
}) => {
  const [selectedForm, setSelectedForm] = useState(SortType.all);

  const sortTodos = (format: SortType) => {
    const url = '/todos?userId=6757';

    switch (format) {
      case SortType.active:
        askTodos(`${url}&completed=false`);
        setSelectedForm(SortType.active);
        break;
      case SortType.completed:
        askTodos(`${url}&completed=true`);
        setSelectedForm(SortType.completed);
        break;

      case SortType.all:
      default:
        askTodos(url);
        setSelectedForm(SortType.all);
        break;
    }
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
              selected: selectedForm === SortType.all,
            },
          )}
          onClick={() => sortTodos(SortType.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link', {
              selected: selectedForm === SortType.active,
            },
          )}
          onClick={() => sortTodos(SortType.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link', {
              selected: selectedForm === SortType.completed,
            },
          )}
          onClick={() => sortTodos(SortType.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={() => clearCompleted('completed')}
        hidden={!countComplited}
      >
        Clear completed
      </button>
    </>
  );
};
