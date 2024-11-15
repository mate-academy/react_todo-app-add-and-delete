import cn from 'classnames';
import { FC } from 'react';
import { Filter } from '../../types/Filters';
import { Todo } from '../../types/Todo';

type Props = {
  countActiveTodos: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
};

export const Footer: FC<Props> = ({
  countActiveTodos,
  filter,
  setFilter,
  todos,
  onDeleteTodo,
}) => {
  const filterOptionName = Object.values(Filter);

  const completedTodos = todos.filter(todo => todo.completed);

  const deleteAllCompletedTodos = () => {
    completedTodos.map(todo => onDeleteTodo(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActiveTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptionName.map(filterValue => {
          const filterActiveUrl =
            filterValue === Filter.All
              ? '#/'
              : `#/${filterValue.toLowerCase()}`;

          return (
            <a
              key={filterValue}
              href={filterActiveUrl}
              className={cn('filter__link', {
                selected: filter === filterValue,
              })}
              data-cy={`FilterLink${filterValue}`}
              onClick={() => setFilter(filterValue)}
            >
              {filterValue}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteAllCompletedTodos}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
