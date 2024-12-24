import { FC, Dispatch, SetStateAction } from 'react';
import { StatusFilter } from '../../types/StatusFilter';
import { TodoFilter } from '../TodoFilter';

type Props = {
  filterValue: StatusFilter;
  setFilterValue: Dispatch<SetStateAction<StatusFilter>>;
  hasCompleted: boolean;
  clearCompleted: () => void;
  activeTodosQuantity: number;
};

export const TodosFooter: FC<Props> = props => {
  const {
    filterValue,
    setFilterValue,
    hasCompleted,
    clearCompleted,
    activeTodosQuantity,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosQuantity} items left
      </span>

      <TodoFilter filterValue={filterValue} setFilterValue={setFilterValue} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
