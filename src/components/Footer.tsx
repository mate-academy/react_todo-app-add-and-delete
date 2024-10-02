import React from 'react';
import { StatusTodos } from '../App';
import { Todo } from '../types/Todo';
import cn from 'classnames';


interface FooterProps {
  status: StatusTodos,
  onChangeStatus: (status: StatusTodos) => void,
  counterOfActiveTodos: number;
  todos: Todo[];
  onClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  status,
  onChangeStatus,
  counterOfActiveTodos,
  todos,
  onClearCompleted
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${counterOfActiveTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
      {Object.values(StatusTodos).map((filter) => (
        <a
          key={filter}
          href={`#/${filter}`}
          className={cn('filter__link', { selected: status === filter })}
          onClick={() => onChangeStatus(filter)}
          data-cy={`FilterLink${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </a>
      ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onClearCompleted}

      >
        Clear completed
      </button>
    </footer>
  );
};
