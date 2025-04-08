import React, { useCallback, useMemo } from 'react';
import { FilterSelectEnum } from '../../types/FilterSelectType';
import { FilterSelect } from '../FilterSelect';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  allTodos: React.MutableRefObject<number>;
  selectedFilter: FilterSelectEnum;
  onSelectedFilter: (option: FilterSelectEnum) => void;
  checkTodoCompleted: () => number;
  handleClearCompleted: () => void;
}

export const Footer: React.FC<Props> = React.memo(
  ({
    todos,
    allTodos,
    selectedFilter,
    onSelectedFilter,
    checkTodoCompleted,
    handleClearCompleted,
  }) => {
    const filterSelect: FilterSelectEnum[] = useMemo(
      () => Object.values(FilterSelectEnum),
      [],
    );

    const itemsLeft = useCallback(() => {
      const activeTodos = todos.filter(todo => !todo.completed);

      if (selectedFilter === FilterSelectEnum.Active) {
        return activeTodos.length === 0 && checkTodoCompleted() === 0
          ? 0
          : activeTodos.length;
      }

      return allTodos.current - checkTodoCompleted();
    }, [todos, allTodos, checkTodoCompleted]);

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {itemsLeft()} items left
        </span>

        <nav className="filter" data-cy="Filter">
          {filterSelect.map(option => (
            <FilterSelect
              key={option}
              option={option}
              onSelectedFilter={onSelectedFilter}
              selectedFilter={selectedFilter}
            />
          ))}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
          disabled={!checkTodoCompleted()}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);

Footer.displayName = 'Footer';
