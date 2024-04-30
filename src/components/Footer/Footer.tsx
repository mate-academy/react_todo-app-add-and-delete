import { useMemo } from 'react';
import { useTodosContext } from '../../context/TodosProvider';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

const Footer = () => {
  const { todos, filter, handleFilterChange, handleDeleteTodo } =
    useTodosContext();

  const getCompletedTodos = (todosList: Todo[]) => {
    return todosList.filter(todo => todo.completed);
  };

  const activeTodos = useMemo(() => {
    const todosCopy = [...todos];

    return todosCopy.filter(todo => !todo.completed);
  }, [todos]);

  const completedTodos = getCompletedTodos(todos);

  const removeCompletedTodos = () => {
    const completedTodosIds = getCompletedTodos(todos).map(t => t.id);

    completedTodosIds.forEach(id => handleDeleteTodo(id)());
  };
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === 'All' })}
          data-cy="FilterLinkAll"
          onClick={handleFilterChange('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filter === 'Active' })}
          data-cy="FilterLinkActive"
          onClick={handleFilterChange('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', { selected: filter === 'Completed' })}
          data-cy="FilterLinkCompleted"
          onClick={handleFilterChange('Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={removeCompletedTodos}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
