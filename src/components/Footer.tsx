import { Status } from '../types/Status';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  itemsLeft: number;
  filter: Status;
  setFilter: (state: Status) => void;
  onDelete: (id: number) => void;
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  filter,
  setFilter,
  todos,
  onDelete,
}) => {
  const todosComppleted = todos.filter(todo => todo.completed);

  const handleClearCompleted = () => {
    todosComppleted.forEach(todo => onDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(state => (
          <a
            key={state}
            href="#/"
            className={cn('filter__link', {
              selected: state === filter,
            })}
            data-cy={`FilterLink${state}`}
            onClick={() => setFilter(state)}
          >
            {state}
          </a>
        ))}
      </nav>

      {!!todosComppleted.length && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
