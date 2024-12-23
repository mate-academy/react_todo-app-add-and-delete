import React from 'react';
import { FilterType } from '../../types/FilterTyper';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  filterBy: FilterType;
  todosCounter: number;
  handleSetFilter: (filter: FilterType) => void;
  todos: Todo[];
  handleDeleteCompletedTodos: () => void;

};

const Footer: React.FC<Props> = React.memo(
  ({ filterBy, todosCounter, handleSetFilter, todos, handleDeleteCompletedTodos }) => {

    const itemsLeftText = `${todosCounter} ${todosCounter === 1 ? 'item left' : 'items left'}`;

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {itemsLeftText}
        </span>
        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">

          {Object.values(FilterType).map((filterOption) => (
            <a
              href={`#/${filterOption}`}
              key={filterOption}
              className={cn("filter__link", {
                "selected": filterBy === filterOption,
              })}
              data-cy={`FilterLink${filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}`}
              onClick={() => handleSetFilter(filterOption)}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </a>
          ))}
        </nav>
        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!todos.some((todo) => todo.completed)}
          onClick={handleDeleteCompletedTodos}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);

Footer.displayName = 'Footer';
export default Footer;
