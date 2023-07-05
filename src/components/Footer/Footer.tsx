import React, { useMemo } from 'react';
import cn from 'classnames';
import { TodosFilter } from '../../types/TodosFilter';
import { Todo } from '../../types/Todo';

interface Props {
  selectFilter: TodosFilter;
  onSelectFilter: (arg: TodosFilter) => void;
  todos: Todo[];
  completeTodoIds: () => void;
}

export const Footer: React.FC<Props> = ({
  selectFilter,
  onSelectFilter,
  todos,
  completeTodoIds,
}) => {
  const numberOfActiveItems = useMemo(() => {
    let counter = 0;

    todos.forEach(todo => {
      if (!todo.completed) {
        counter += 1;
      }
    });

    return counter;
  }, [todos]);

  const isEvenOneCompleted = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${numberOfActiveItems} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectFilter === TodosFilter.ALL,
          })}
          onClick={() => onSelectFilter(TodosFilter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectFilter === TodosFilter.ACTIVE,
          })}
          onClick={() => onSelectFilter(TodosFilter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectFilter === TodosFilter.COMPLETED,
          })}
          onClick={() => onSelectFilter(TodosFilter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          hidden: !isEvenOneCompleted,
        })}
        onClick={() => completeTodoIds()} //! ====
      >
        Clear completed
      </button>
    </footer>
  );
};
