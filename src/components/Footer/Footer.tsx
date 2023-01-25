import { memo } from 'react';
import cn from 'classnames';
import { Filter } from '../Filter/Filter';
import { FilterType } from '../../types/FilterType';

interface Props {
  uncompletedTodosLength: number,
  completedTodosLength: number,
  complitedFilter: FilterType,
  setComplitedFilter: (filter: FilterType) => void,
  clearComplitedTodos: () => void;
}

export const Footer:React.FC<Props> = memo(({
  uncompletedTodosLength,
  completedTodosLength,
  complitedFilter,
  setComplitedFilter,
  clearComplitedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedTodosLength} items left`}
      </span>

      <Filter
        complitedFilter={complitedFilter}
        setComplitedFilter={setComplitedFilter}
      />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': !completedTodosLength,
        })}
        onClick={clearComplitedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
