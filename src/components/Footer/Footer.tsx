import { FC, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoFilters } from '../../types/TodoFilters';
import { TodoFilter } from '../TodoFilter';

type Props = {
  activeTodos: number,
  onSetFilter: (filter: TodoFilters) => void,
  filter: TodoFilters,
  todos: Todo[],
  handleClearComplited: () => void,
};

export const Footer: FC<Props> = memo(({
  activeTodos,
  onSetFilter,
  filter,
  todos,
  handleClearComplited,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos} items left`}
      </span>

      <TodoFilter
        onFilterBy={onSetFilter}
        currentFilter={filter}
      />
      <button
        data-cy=" "
        type="button"
        className="todoapp__clear-completed"
        style={todos.some(todo => todo.completed)
          ? {}
          : { visibility: 'hidden' }}
        onClick={handleClearComplited}
      >
        Clear completed
      </button>
    </footer>
  );
});
