import { Dispatch, FC, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { FilterType } from '../enum/filterTypes';

interface Props {
  setFilter: Dispatch<SetStateAction<FilterType>>;
  filter: string;
  todos: Todo[];
  onDelete: (userId: number) => void;
}

export const Footer: FC<Props> = ({ setFilter, filter, todos, onDelete }) => {
  const handleActiveTodos = todos.reduce((acc, val) => {
    if (!val.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        onDelete(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {handleActiveTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(FilterType).map(([key, value]) => {
          const href = value === FilterType.All ? '#/' : `#/${value}`;

          return (
            <a
              key={key}
              href={href}
              className={classNames('filter__link', {
                selected: value === filter,
              })}
              data-cy={`FilterLink${key}`}
              onClick={() => setFilter(value)}
            >
              {key}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
