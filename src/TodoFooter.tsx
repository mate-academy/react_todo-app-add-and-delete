import classNames from 'classnames';
import React from 'react';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';

interface Props {
  completedTodos: Todo[] | [];
  filter: string;
  onChange: (filter: TodoFilter) => void;
  onDelete: (arrayId: number[]) => Promise<void>;
  activeItems: number;
}

export const TodoFooter: React.FC<Props> = ({
  completedTodos,
  filter,
  onChange,
  onDelete,
  activeItems,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeItems} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(TodoFilter).map(filterOption => (
          <a
            key={filterOption}
            href="#/"
            className={classNames('filter__link', {
              selected: filterOption === filter,
            })}
            data-cy={`FilterLink${filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}`}
            onClick={() => onChange(filterOption)}
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
        disabled={completedTodos.length === 0}
        onClick={() => onDelete(completedTodos.map(todo => todo.id))}
      >
        Clear completed
      </button>
    </footer>
  );
};
