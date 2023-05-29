import { Filter } from './Filter';

interface FooterProps {
  filter: string,
  filterAll: () => void,
  filterActive: () => void,
  filterCompleted: () => void,
  hasCompleted: boolean,
  todosLength: number,
  onRemoveCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  filter,
  filterAll,
  filterActive,
  filterCompleted,
  hasCompleted,
  todosLength,
  onRemoveCompleted,
}) => {
  return (
    todosLength > 0 ? (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${todosLength} items left`}
        </span>

        <Filter
          filter={filter}
          filterActive={filterActive}
          filterAll={filterAll}
          filterCompleted={filterCompleted}
        />

        <button
          type="button"
          className="todoapp__clear-completed"
          style={{ visibility: hasCompleted ? 'visible' : 'hidden' }}
          onClick={onRemoveCompleted}
        >
          Clear completed
        </button>
      </footer>
    ) : null
  );
};
