import classNames from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  handleFilterBy: (str: TodoStatus) => void,
  filterBy: TodoStatus,
  itemsLeft: number,
  completedTodos: number,
  clearCompletedTodos: () => void,
};

export const TodoFooter: React.FC<Props> = ({
  handleFilterBy,
  filterBy,
  itemsLeft,
  completedTodos,
  clearCompletedTodos,
}) => {
  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = event.target as HTMLAnchorElement;

    handleFilterBy(target.innerText as TodoStatus);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: TodoStatus.All === filterBy,
          })}
          onClick={onClick}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: TodoStatus.Active === filterBy,
          })}
          onClick={onClick}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: TodoStatus.Completed === filterBy,
          })}
          onClick={onClick}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!completedTodos}
        onClick={() => clearCompletedTodos()}
      >
        Clear completed
      </button>
    </footer>
  );
};
