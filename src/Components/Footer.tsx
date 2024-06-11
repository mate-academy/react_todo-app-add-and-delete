import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  setSelectedValue: (value: Status) => void;
  todosLeft: number;
  selectedValue: string;
  completedTodos: Todo[];
  deleteAllCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  setSelectedValue,
  todosLeft,
  selectedValue,
  completedTodos,
  deleteAllCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(value => (
          <a
            href={`#/${value}`}
            className={cn('filter__link', {
              selected: selectedValue === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => setSelectedValue(value)}
            key={value}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
