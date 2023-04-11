import classNames from 'classnames';
import { LoadType } from '../../types/LoadType';

type Props = {
  typeOfLoad: LoadType;
  setTypeOfLoad: (typeOfLoad: LoadType) => void;
  activeTodos: number;
  completedTodos: number;
  onDeleteCompleted: () => void
};

export const Footer: React.FC<Props> = ({
  typeOfLoad,
  setTypeOfLoad,
  activeTodos,
  completedTodos,
  onDeleteCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodos} items left`}
    </span>

    <nav className="filter">
      {Object.values(LoadType).map((type) => (
        <a
          key={type}
          href="#/"
          className={classNames(
            'filter__link',
            { type: type === typeOfLoad },
          )}
          onClick={() => setTypeOfLoad(type)}
        >
          {type}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className={classNames(
        'todoapp__clear-completed',
        'filter__link',
        { hidden: completedTodos === 0 },
      )}
      onClick={onDeleteCompleted}
    >
      Clear completed
    </button>
  </footer>
);
