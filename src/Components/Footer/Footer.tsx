import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => void;
  filterBy: FilterBy;
  setFilterBy: (value: FilterBy) => void;
};

export const Footer: FC<Props> = ({
  todos,
  removeTodo,
  filterBy,
  setFilterBy,
}) => {
  const complitedTodo = todos.filter(todo => todo.completed);
  const uncomplitedTodo = todos.filter(todo => !todo.completed);

  const handleClearComplited = () => {
    complitedTodo.forEach(async (todo) => {
      await removeTodo(todo.id);
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {uncomplitedTodo.length}
        {' '}
        items left
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        {Object.values(FilterBy).map((filter) => (
          <a
            href="#/"
            className={cn('filter__link',
              { selected: filterBy === filter })}
            onClick={() => setFilterBy(filter)}
            key={filter}
          >
            {filter}
          </a>
        ))}
      </nav>

      {complitedTodo.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearComplited}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
