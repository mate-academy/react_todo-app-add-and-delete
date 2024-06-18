import { useCallback, useEffect, useState } from 'react';
import { FiltersEnum } from '../../utils/FiltersEnum';
import { TodoFilterProps } from '../../types/ComponentsProps';

export const TodoFilter: React.FC<TodoFilterProps> = ({
  todoList,
  filterTodoList,
  updateClearDisabled,
}) => {
  const [selectedFilter, setSelecetedFilter] = useState<FiltersEnum>(
    FiltersEnum.All,
  );

  useEffect(() => {
    const filteredTodos = todoList.filter(todo => {
      switch (selectedFilter) {
        case FiltersEnum.Active:
          return !todo.completed;
        case FiltersEnum.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });

    filterTodoList(filteredTodos);
    updateClearDisabled();
  }, [selectedFilter, todoList, filterTodoList, updateClearDisabled]);

  const handleSelectFilter = useCallback((filter: FiltersEnum) => {
    setSelecetedFilter(filter);
  }, []);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${selectedFilter === FiltersEnum.All ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
        onClick={() => handleSelectFilter(FiltersEnum.All)}
      >
        {FiltersEnum.All}
      </a>

      <a
        href="#/active"
        className={`filter__link ${selectedFilter === FiltersEnum.Active ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
        onClick={() => handleSelectFilter(FiltersEnum.Active)}
      >
        {FiltersEnum.Active}
      </a>

      <a
        href="#/completed"
        className={`filter__link ${selectedFilter === FiltersEnum.Completed ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
        onClick={() => handleSelectFilter(FiltersEnum.Completed)}
      >
        {FiltersEnum.Completed}
      </a>
    </nav>
  );
};
