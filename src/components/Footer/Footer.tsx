import { useContext } from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/enums/Filter';
import { Error } from '../../types/enums/Error';
import { deleteTodo } from '../../api/todos';
import { DispatchContext, StateContext } from '../../TodosContext';
import { ReducerType } from '../../types/enums/ReducerType';

interface Props {
  updateTodos: () => void
}

export const Footer: React.FC<Props> = ({ updateTodos }) => {
  const { todos, filter } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const activeTodosLength = todos?.filter(({ completed }) => !completed).length;
  const completedTodos
    = todos?.filter(({ completed }) => completed);

  const handleClearCompletedTodos = () => {
    if (completedTodos?.length) {
      Promise.all(
        completedTodos.map((todo) => deleteTodo(todo.id)),
      )
        .catch(() => dispatch({
          type: ReducerType.SetError,
          payload: Error.UnabletoDeleteATodo,
        }))
        .finally(() => updateTodos());
    }
  };

  const handleFilterAll = () => dispatch({
    type: ReducerType.SetFilter,
    payload: Filter.All,
  });

  const handleFilterActive = () => dispatch({
    type: ReducerType.SetFilter,
    payload: Filter.Active,
  });

  const handleFilterCompleted = () => dispatch({
    type: ReducerType.SetFilter,
    payload: Filter.Completed,
  });

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: Filter.All === filter,
          })}
          onClick={handleFilterAll}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: Filter.Active === filter,
          })}
          onClick={handleFilterActive}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: Filter.Completed === filter,
          })}
          onClick={handleFilterCompleted}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      {
        !!completedTodos?.length && (
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={handleClearCompletedTodos}
          >
            Clear completed
          </button>
        )
      }
    </footer>
  );
};
