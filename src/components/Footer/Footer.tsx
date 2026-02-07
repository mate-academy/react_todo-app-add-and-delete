import React from 'react';
import { Link } from '../Link/Link';
import { Todo } from '../../types/Todo';
import { filterQuery } from '../../constants/constants';
import { Staus } from '../../types/Starus';

type Props = {
  todos: Todo[];
  statusTodo: Staus;
  deleteCompleted: () => void;
  onClick: (filter: Staus) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  onClick,
  statusTodo,
  deleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todoItem => !todoItem.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterQuery.map(query => (
          <Link
            key={query}
            href={`#/${query === 'All' ? '' : query.toLowerCase()}`}
            className="filter__link"
            dataCy={`FilterLink${query}`}
            onClick={() => onClick(query)}
            content={query}
            status={statusTodo}
          />
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}

      <button
        onClick={deleteCompleted}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
