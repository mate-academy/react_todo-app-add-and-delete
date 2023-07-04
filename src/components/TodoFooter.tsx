import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  visibleTodos: Todo[],
  selectedNav: string,
  setSelectedNav: (value: string) => void,
  handleClearCompletedTodos: () => void,
}

export const TodoFooter: FC<Props> = ({
  visibleTodos,
  selectedNav,
  setSelectedNav,
  handleClearCompletedTodos,
}) => {
  const isSomeCompeletedTodos = visibleTodos.some(todo => (
    todo.completed === true));

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${visibleTodos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedNav === 'All',
          })}
          onClick={() => setSelectedNav('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedNav === 'Active',
          })}
          onClick={() => setSelectedNav('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedNav === 'Completed',
          })}
          onClick={() => setSelectedNav('Completed')}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        style={isSomeCompeletedTodos
          ? {}
          : { opacity: 0 }}
        onClick={handleClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
