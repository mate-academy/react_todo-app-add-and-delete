import React from 'react';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import classNames from 'classnames';

interface FooterProps {
  activeTodos: number;
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  todos: Todo[];
  clearCompleted: () => void;
}

const Footer: React.FC<FooterProps> = ({
  activeTodos,
  filter,
  setFilter,
  todos,
  clearCompleted,
}) => {
  const itemText = activeTodos === 1 ? 'item' : 'items';

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} {itemText} left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(type => (
          <a
            key={type}
            href={`#/${type === FilterType.All ? '' : type}`}
            className={classNames('filter__link', {
              selected: filter === type,
            })}
            data-cy={`FilterLink${type.charAt(0).toUpperCase() + type.slice(1)}`}
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
