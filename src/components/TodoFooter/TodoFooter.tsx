import React, { useContext } from 'react';
import cn from 'classnames';
import { StateFilter } from '../../types/StateFilter';
import { TodoContext } from '../TodoContext';

type Props = {
  deleteAllCompleted: () => void,
};

export const TodoFooter: React.FC<Props> = ({
  deleteAllCompleted,
}) => {
  const {
    todos, selectedState, setSelectedState,
  } = useContext(TodoContext);

  const notActiveTodos = todos.filter(todo => !todo.completed);
  const someCompletedTodo = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${notActiveTodos.length} items left`}
      </span>

      <nav
        className="filter"
        data-cy="Filter"
      >
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedState === StateFilter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedState(StateFilter.All)}
        >
          {StateFilter.All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedState === StateFilter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedState(StateFilter.Active)}
        >
          {StateFilter.Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedState === StateFilter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedState(StateFilter.Completed)}
        >
          {StateFilter.Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!someCompletedTodo}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
