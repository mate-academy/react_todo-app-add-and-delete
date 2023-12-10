import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterTodos } from '../../utils/FilterTodos';

type Props = {
  todos: Todo[],
  filteredTodos: FilterTodos,
  setfilteredTodos: (value: FilterTodos) => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filteredTodos,
  setfilteredTodos,
}) => {
  const haveComplitedTodos = todos.filter(todo => todo.completed).length;
  const haveActiveTodos = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${haveActiveTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterTodos).map(item => (
          <a
            key={item}
            href={`#/${FilterTodos.ALL ? '' : item.toLowerCase()}`}
            // className="filter__link"
            className={cn('filter__link', {
              selected: item === filteredTodos,
            })}
            data-cy={`FilterLink${item}`}
            onClick={() => setfilteredTodos(item)}
          >
            {item}
          </a>
        ))}
      </nav>

      {/* don't show this button if there are no completed todos */}
      {haveComplitedTodos > 0 && (
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
