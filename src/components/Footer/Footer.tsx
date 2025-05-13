import { Filter } from '../../hooks/general';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  todos: Todo[];
  clear: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  todos,
  clear,
}) => {
  const completed = todos.filter(todo => todo.completed === true);
  const total = todos.length;
  const count = total - completed.length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${count} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(en => (
          <a
            key={en}
            href={`#/${en.toLowerCase()}`}
            onClick={() => setFilter(en)}
            className={classNames('filter__link', {
              selected: filter === en,
            })}
            data-cy={`FilterLink${en}`}
          >
            {en}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completed.length < 1}
        onClick={clear}
      >
        Clear completed
      </button>
    </footer>
  );
};
