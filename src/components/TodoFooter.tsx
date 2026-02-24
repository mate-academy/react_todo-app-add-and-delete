import React from 'react';
import { FilterType } from '../types/FilterType';
import { getNoun, t } from '../utils/phrases';
import { TodoFilter } from './TodoFilter';

interface Props {
  activeTodosCount: number;
  completedTodosCount: number;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onDeleteCompleted: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  filter,
  onFilterChange,
  onDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {t('footer.itemsLeft', {
          count: activeTodosCount,
          noun: getNoun(activeTodosCount, 'noun.item', 'noun.items'),
        })}
      </span>

      <TodoFilter filter={filter} onFilterChange={onFilterChange} />

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={() => onDeleteCompleted()}
      >
        {t('button.clearCompleted')}
      </button>
    </footer>
  );
};
