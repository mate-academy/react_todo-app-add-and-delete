import cn from 'classnames';

import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

type Props = {
  onChangeFilter: (v: Status) => void;
  filteredSelected: Status;
  todos: Todo[];
};

const filterOptions = [
  { type: Status.ALL, value: 'All' },
  { type: Status.ACTIVE, value: 'Active' },
  { type: Status.COMPLETED, value: 'Completed' },
];

export const TodoFooter: React.FC<Props> = ({
  onChangeFilter,
  filteredSelected,
  todos,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;

  const handleSelected = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    type: Status,
  ) => {
    event.preventDefault();
    onChangeFilter(type);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        {filterOptions.map(({ type, value }) => (
          <a
            key={type}
            href={`#/${type.toLowerCase()}`}
            className={`filter__link ${cn({
              selected: filteredSelected === type,
            })}`}
            onClick={(event) => handleSelected(event, type)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
