import { Dispatch, FC, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { FilterType } from '../enum/filterTypes';

interface Props {
  setFilter: Dispatch<SetStateAction<FilterType>>;
  filter: string;
  todos: Todo[];
  onDelete: (userId: number) => Promise<void>;
}

export const Footer: FC<Props> = ({ setFilter, filter, todos, onDelete }) => {
  const countActiveTodos = todos.filter(todo => !todo.completed).length;

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    for (const todo of completedTodos) {
      try {
        await onDelete(todo.id);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to delete todo with id ${todo.id}`, error);
      }
    }
  };

  const someCompleted = todos.some(todo => todo.completed === true);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActiveTodos} items left
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
        disabled={!someCompleted}
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
