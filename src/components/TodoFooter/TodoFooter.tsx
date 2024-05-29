import { memo, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';
import { deleteTodo } from '../../api/todos';

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

  const handleClearCompleted = async () => {
    const completedTodos = state.todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      dispatch({
        type: 'SET_TODO_DISABLED',
        payload: {
          value: true,
          targetId: todo.id,
        },
      });
    });

    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    const results = await Promise.allSettled(deletePromises);

    results.forEach((result, index) => {
      const todoId = completedTodos[index].id;

      if (result.status === 'fulfilled') {
        dispatch({ type: 'DELETE_TODO', payload: todoId });
      } else {
        dispatch({
          type: 'UPDATE_ERROR_STATUS',
          payload: { type: 'DeleteTodoError' },
        });
      }

      dispatch({
        type: 'SET_TODO_DISABLED',
        payload: {
          value: false,
          targetId: todoId,
        },
      });
    });
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
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
});

TodoFooter.displayName = 'TodoFooter';
