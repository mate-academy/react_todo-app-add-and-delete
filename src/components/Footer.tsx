import cn from 'classnames';
import { useContext } from 'react';

import { FilterStatus } from '../types/FilterStatus';
import { DispatchContext, StateContext } from './TodosProvider';
import { deleteTodo } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

export const Footer = () => {
  const { filteredBy, todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const filteredStatus = Object.values(FilterStatus);

  const completedTodosCount = todos.filter(
    todo => todo.completed,
  )
    .length || 0;

  const unCompletedTodosCount = todos.length - completedTodosCount;

  const clearCompletedTodos = async () => {
    dispatch({ type: 'deleteCompletedTodos' });

    todos.forEach(async todo => {
      if (todo.completed) {
        try {
          await deleteTodo(todo.id);

          dispatch({
            type: 'deleteTodo',
            payload: todo.id,
          });
        } catch (error) {
          dispatch({
            type: 'error',
            payload: ErrorMessage.Deleting,
          });
        }
      }
    });
  };

  const filterTodos = (item: FilterStatus) => {
    dispatch({
      type: 'filter',
      payload: item,
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${unCompletedTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {
          filteredStatus.map(item => (
            <a
              href={
                `#/${
                  item === FilterStatus.All
                    ? ''
                    : item.toLowerCase()
                }`
              }
              className={
                cn(
                  'filter__link',
                  { selected: filteredBy === item },
                )
              }
              data-cy={`FilterLink${item}`}
              key={item}
              onClick={() => filterTodos(item)}
            >
              {item}
            </a>
          ))
        }
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosCount}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
