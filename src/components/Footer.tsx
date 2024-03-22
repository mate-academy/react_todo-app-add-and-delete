import { useContext } from 'react';
import classNames from 'classnames';
import { SetTodosContext, TodosContext } from './TodosContext';
import { deleteCompletedTodos } from '../api/todos';
import { Filter } from '../types/Filter';

type Props = {
  setFilter: (newFilter: Filter) => void;
  filter: Filter;
};

export const Footer: React.FC<Props> = ({ setFilter, filter }) => {
  const todos = useContext(TodosContext);
  const setTodos = useContext(SetTodosContext);

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  const handleClearCompleted = () => {
    const todosToDelete = todos.filter(todo => todo.completed);

    deleteCompletedTodos(todosToDelete);
    setTodos(prevTodos => {
      return prevTodos.filter(todo => !todo.completed);
    });
  };

  const handleFiltration = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFiltration(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFiltration(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFiltration(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
