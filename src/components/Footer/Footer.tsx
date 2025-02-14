import classNames from 'classnames';
import { Status } from '../../App';

type FooterProps = {
  counterTodos: number;
  counterCompletedTodos: number;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  clearCompleted: () => void;
};

export const Footer: React.FC<FooterProps> = ({
  counterTodos,
  counterCompletedTodos,
  status,
  setStatus,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {counterTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(statusValue => (
          <a
            key={statusValue}
            href={`#/${statusValue.toLocaleLowerCase()}`}
            className={classNames('filter__link', {
              selected: status === statusValue,
            })}
            data-cy={`FilterLink${statusValue}`}
            onClick={() => {
              setStatus(statusValue);
            }}
          >
            {statusValue}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={counterCompletedTodos === 0}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
