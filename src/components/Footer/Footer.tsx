import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../Filter/Filter';

type Props = {
  filterType: string,
  incompletedTodos: Todo[],
  completedTodosAmount: number,
  handleButtonClickAll: () => void,
  handleButtonClickActive: () => void,
  handleButtonClickCompleted: () => void,
  deleteCompleated: () => void,

};

export const Footer: React.FC<Props> = memo(({
  filterType,
  incompletedTodos,
  completedTodosAmount,
  handleButtonClickAll,
  handleButtonClickActive,
  handleButtonClickCompleted,
  deleteCompleated,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {filterType
        ? (
          <span className="todo-count" data-cy="todosCounter">
            {`${incompletedTodos.length} items left`}
          </span>
        ) : (
          <span className="todo-count" data-cy="todosCounter">
            0 items left
          </span>
        )}

      <Filter
        filterType={filterType}
        handleButtonClickAll={handleButtonClickAll}
        handleButtonClickActive={handleButtonClickActive}
        handleButtonClickCompleted={handleButtonClickCompleted}
      />

      {completedTodosAmount !== 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteCompleated}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
});
