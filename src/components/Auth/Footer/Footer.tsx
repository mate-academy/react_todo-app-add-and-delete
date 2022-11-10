import React from 'react';
import { Todo } from '../../../types/Todo';
import { FilterType } from '../../../utils/enums/FilterType';
import { Navigation } from '../Navigation';

type Props = {
  filterType: FilterType;
  todos: Todo[];
  completedTodos: Todo[];
  onFilter: (filterType: FilterType) => void;
  handleCompletedDeleting: () => void;
};

export const Footer: React.FC<Props> = ({
  filterType,
  todos,
  completedTodos,
  onFilter,
  handleCompletedDeleting,
}) => {
  const todosLeft = todos.length - completedTodos.length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <Navigation filterType={filterType} onFilter={onFilter} />

      {completedTodos.length > 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={handleCompletedDeleting}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
