import cn from 'classnames';
import { useContext } from 'react';
import { DispatchContext, StateContext } from '../../State/State';
import {
  handleDeleteAll,
  isCompletedTodo,
} from '../../services/todosServices';
import { Filter } from '../../types/Filter';

export const Footer = () => {
  const dispatch = useContext(DispatchContext);
  const { todos, filterBy, activeTodos } = useContext(StateContext);

  return (
    // {/* Hide the footer if there are no todos */}
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === Filter.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => dispatch({ type: 'setFilter', payload: Filter.all })}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === Filter.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => dispatch({
            type: 'setFilter',
            payload: Filter.active,
          })}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === Filter.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => dispatch({
            type: 'setFilter',
            payload: Filter.completed,
          })}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {isCompletedTodo(todos) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={() => handleDeleteAll(todos, dispatch)}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
