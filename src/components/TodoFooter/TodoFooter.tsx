import { memo, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';
import { deleteTodo, getTodos } from '../../api/todos';

export const TodoFooter: React.FC = memo(() => {
  const { state, dispatch } = useContext(AppContext);
  const { todos, filter } = state;

  const filterOptions: Filter[] = [Filter.All, Filter.Active, Filter.Completed];
  const buttonDisabled = todos.filter(todo => todo.completed).length === 0;
  // TODO check after UPD implementation
  const activeTodosAmount = todos.filter(todo => !todo.completed).length;

  const handleSetFiltration = (filterOption: number) => {
    dispatch({
      type: 'SET_FILTER',
      payload: filterOption as Filter,
    });
  };

  const handleClearComleted = async () => {
    const completedIds = state.todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    for (const value of completedIds) {
      dispatch({
        type: 'SET_TODO_DISABLED',
        payload: {
          value: true,
          targetId: value,
        },
      });
      dispatch({ type: 'DELETE_TODO', payload: value });

      try {
        await deleteTodo(value);

        dispatch({ type: 'LOAD_TODOS_FROM_SERVER', payload: await getTodos() });
      } catch (error) {
        dispatch({
          type: 'UPDATE_ERROR_STATUS',
          payload: { type: 'DeleteTodoError' },
        });
        throw error;
      } finally {
        dispatch({
          type: 'SET_TODO_DISABLED',
          payload: {
            value: false,
            targetId: 0,
          },
        });
      }
    }
  };

  return (
    // TODO better condition to show footer? todos.length > 0
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${activeTodosAmount} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            {filterOptions.map(value => (
              <a
                key={value}
                href={`#/${value === Filter.All ? '' : Filter[value].toLowerCase()}`}
                className={classNames('filter__link', {
                  selected: value === filter,
                })}
                data-cy={`FilterLink${Filter[value]}`}
                onClick={() => handleSetFiltration(value)}
              >
                {Filter[value]}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={buttonDisabled}
            onClick={handleClearComleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
});

TodoFooter.displayName = 'TodoFooter';
