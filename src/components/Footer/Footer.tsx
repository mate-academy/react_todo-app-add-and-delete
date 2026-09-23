import { TodoFilter } from '../TodoFilter';

import type { FilterBy } from '../../types/Filter';
import type { Todo } from '../../types/Todo';

type Props = {
  filterBy: FilterBy;
  onFilterSelect: (filterBy: FilterBy) => void;
  activeTodos: Todo[];
  completedTodos: Todo[];
  onDeleteCompleted: () => void;
};

export const Footer = ({
  filterBy,
  onFilterSelect,
  activeTodos,
  completedTodos,
  onDeleteCompleted,
}: Props) => {
  return (
    <footer className="todoapp__footer hidden" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <TodoFilter filterBy={filterBy} onFilterSelect={onFilterSelect} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length <= 0 ? true : false}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
