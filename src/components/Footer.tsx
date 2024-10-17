import { FC, Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  setFilterStatus: Dispatch<SetStateAction<FilterStatus>>;
  handleDeleteTodo: (todoId: number) => void;
};

export const Footer: FC<Props> = ({
  todos,
  filterStatus,
  setFilterStatus,
  handleDeleteTodo,
}) => {
  const notCompletedTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const deleteCompletedTodos = () => {
    completedTodos.map(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const filters = Object.values(FilterStatus);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filter => {
          const selectedFilter = filter === filterStatus;
          const filterActiveLink =
            filter === 'All' ? '#/' : `#/${filter.toLowerCase()}`;

          return (
            <a
              href={filterActiveLink}
              className={cn('filter__link', {
                selected: selectedFilter,
              })}
              data-cy={`FilterLink${filter}`}
              key={filter}
              onClick={() => setFilterStatus(filter)}
            >
              {filter}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
