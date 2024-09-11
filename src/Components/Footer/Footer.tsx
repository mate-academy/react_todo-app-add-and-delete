import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterValues } from '../../types/FilterValues';

type Props = {
  todos: Todo[];
  currentFilter: FilterValues;
  onChangeFilter: (newValue: FilterValues) => void;
  onDelete: (todoId: number) => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  todos,
  currentFilter,
  onChangeFilter,
  onDelete,
}) => {
  const countActiveTodos = useMemo(() => {
    return todos.reduce((sum, todo) => sum + Number(!todo.completed), 0);
  }, [todos]);

  const handleClearCompletedTodos = () => {
    todos.filter(todo => todo.completed).forEach(todo => onDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActiveTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.keys(FilterValues).map(key => (
          <a
            key={key}
            href={`#/${FilterValues[key as keyof typeof FilterValues]}`}
            className={classNames('filter__link', {
              selected:
                currentFilter ===
                FilterValues[key as keyof typeof FilterValues],
            })}
            data-cy={`FilterLink${key}`}
            onClick={() =>
              onChangeFilter(FilterValues[key as keyof typeof FilterValues])
            }
          >
            {key}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.length === countActiveTodos}
        onClick={handleClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
