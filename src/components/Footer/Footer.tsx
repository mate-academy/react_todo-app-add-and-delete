import { FC } from 'react';
import { Filter } from '../Filter/Filter';
import { Todo } from '../../types/Todo';
import { Filters } from '../../types/Filters';

type Props = {
  todosFromServer: Todo[];
  filter: Filters;
  onFilterChange: (value: Filters) => void;
};

export const Footer: FC<Props> = ({
  todosFromServer,
  filter,
  onFilterChange,
}) => {
  const completedTodos = todosFromServer.filter((todo) => todo.completed);
  const todosRemaining = todosFromServer.filter((todo) => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosRemaining.length}
        {' '}
        items left
      </span>

      {/* Active filter should have a 'selected' class */}
      <Filter filter={filter} onFilterChange={onFilterChange} />

      {/* don't show this button if there are no completed todos */}
      {completedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
