import { useContext } from 'react';
import cn from 'classnames';
import { DispatchContext, StateContext } from './TodosContext';
import { Status } from '../Types/Status';
import { deleteTodo } from '../api/todos';

export const Footer: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { todos, filterBy } = useContext(StateContext);

  const compleatedTodosIds
    = todos.filter((todo) => todo.completed).map((todo) => todo.id);

  const changeFilter = (filter: Status) => {
    dispatch({ type: 'filterBy', payload: filter });
  };

  const activeTodos
    = todos.filter((todo) => !todo.completed).length;
  const completedTodos
    = todos.filter((todo) => todo.completed).length;

  const clearCompletedTodos = () => {
    dispatch({
      type: 'setLoading',
      payload: { isLoading: true, todoIds: compleatedTodosIds },
    });

    compleatedTodosIds.forEach((id) => {
      deleteTodo(id)
        .then(() => dispatch({ type: 'deleteTodo', payload: id }));
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos && `${activeTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: filterBy === Status.ALL },
          )}
          data-cy="FilterLinkAll"
          onClick={() => changeFilter(Status.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filterBy === Status.ACTIVE },
          )}
          data-cy="FilterLinkActive"
          onClick={() => changeFilter(Status.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filterBy === Status.COMPLETED },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => changeFilter(Status.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {completedTodos > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompleted"
          onClick={clearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
