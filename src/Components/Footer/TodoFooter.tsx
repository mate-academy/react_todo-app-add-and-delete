import React, { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { Filter, filterValues } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todosQuantity: number;
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  todos: Todo[];
  onDelete: (todoId: number) => void;
};

export const TodoFooter: React.FC<Props> = ({
  todosQuantity,
  filter,
  setFilter,
  todos,
  onDelete,
}) => {
  const deleteAllCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    return completedTodos.map(todo => onDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosQuantity} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterValues.map(currentFilter => {
          const letters = currentFilter.split('');
          const [first, ...elseLetters] = letters;
          const capital = first.toUpperCase();
          const displayedFilter = [capital, elseLetters.join('')].join('');

          return (
            <a
              key={currentFilter}
              href={`#/${currentFilter}`}
              className={cn('filter__link', {
                selected: filter === currentFilter,
              })}
              data-cy={`FilterLink${displayedFilter}`}
              onClick={() => setFilter(currentFilter)}
            >
              {displayedFilter}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
