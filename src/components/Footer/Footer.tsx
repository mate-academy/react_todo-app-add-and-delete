import React, { useContext } from 'react';
import classNames from 'classnames';
import { StateContext } from '../../store/State';
import { FILTERS } from '../../utils/constants';
import { Filter } from '../../types/Filter';

type Props = {
  activeFilter: Filter;
};

export const Footer: React.FC<Props> = ({ activeFilter }) => {
  const { todos } = useContext(StateContext);
  const todosCount = todos.filter(todo => !todo.completed).length;
  const isOnlyOneActiveTodo = todosCount === 1;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCount} item${isOnlyOneActiveTodo ? '' : 's'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(({ type, hash, name }) => (
          <a
            href={hash}
            className={classNames('filter__link', {
              selected: activeFilter.type === type,
            })}
            data-cy={`FilterLink${name}`}
            key={name}
          >
            {name}
          </a>
        ))}
      </nav>

      {todos.length !== todosCount && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
