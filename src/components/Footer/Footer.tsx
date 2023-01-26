import cn from 'classnames';
import React, { useContext } from 'react';
import { deleteTodo } from '../../api/todos';
import { AppContext } from '../../AppContext';
import { ErrorType } from '../../types/ErrorType';
import { FilterStatus } from '../../types/FilterStatus';

export const Footer:React.FC = () => {
  const {
    filterStatus,
    setFilterStatus,
    todos,
    setError,
    setTodos,
    setIsLoading,
  } = useContext(AppContext);

  const activeTodos = todos.filter(todo => !todo.completed);
  const activeTodosCount = activeTodos.length;
  const completedTodos = todos.filter(todo => todo.completed);

  const deleteCompletedTodos = async () => {
    try {
      setIsLoading(true);
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
      setTodos(activeTodos);
      setIsLoading(false);
    } catch (err) {
      setError(ErrorType.RemovalError);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.All })}
          onClick={() => setFilterStatus(FilterStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.Active })}
          onClick={() => setFilterStatus(FilterStatus.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.Completed })}
          onClick={() => setFilterStatus(FilterStatus.Completed)}
        >
          Completed
        </a>

      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompletedTodos}
        style={{
          visibility: completedTodos.length
            ? 'visible'
            : 'hidden',
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
