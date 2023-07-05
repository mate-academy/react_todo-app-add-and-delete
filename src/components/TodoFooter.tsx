import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { FilterTodos } from '../types/FilterTodos';

interface Props {
  visibleTodos: Todo[],
  filtredTodos: string,
  setFiltredTodos: (value: string) => void,
  handleClearCompletedTodos: () => void,
}

export const TodoFooter: FC<Props> = ({
  visibleTodos,
  filtredTodos,
  setFiltredTodos,
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
            selected: filtredTodos === FilterTodos.all,
          })}
          onClick={() => setFiltredTodos(FilterTodos.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filtredTodos === FilterTodos.active,
          })}
          onClick={() => setFiltredTodos(FilterTodos.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filtredTodos === FilterTodos.completed,
          })}
          onClick={() => setFiltredTodos(FilterTodos.completed)}
        >
          Completed
        </a>
      </nav>

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
