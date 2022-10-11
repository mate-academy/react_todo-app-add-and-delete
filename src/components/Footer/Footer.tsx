import { Filter } from '../Filter/Filter';
import { Props } from './FooterPropTypes';

export const Footer : React.FC<Props> = ({
  setFilterType,
  filterType,
  clearCompleted,
  countOfItemsLeft,
  todosLength,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${countOfItemsLeft} items left`}
      </span>
      <Filter setFilterType={setFilterType} filterType={filterType} />

      {todosLength > countOfItemsLeft && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => clearCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
