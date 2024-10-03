import classNames from 'classnames';
import { Filter } from '../../App';
import { Todo } from '../../types/types';

type Props = {
  todos: Todo[];
  filter: string;
  handleFilter: (value: string) => void;
  completedCount: number;
  deleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  handleFilter,
  completedCount,
  deleteCompletedTodos,
}) => {
  return (
    <>
      {!!todos.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${todos.filter(todo => !todo.completed).length} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            {Object.values(Filter).map(option => (
              <a
                key={option}
                href={`#/${option}`}
                className={classNames('filter__link', {
                  selected: filter === option,
                })}
                data-cy={`FilterLink${option.charAt(0).toUpperCase() + option.slice(1)}`}
                onClick={() => handleFilter(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={completedCount < 1}
            onClick={deleteCompletedTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
