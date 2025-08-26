import cn from 'classnames';
import { Todo } from '../types/Todo';
import { SORTFIELD } from '../types/SortField';
import { Processing } from '../types/Processing';

type Props = {
  todos: Todo[];
  sortField: SORTFIELD;
  setSortField: (value: SORTFIELD) => void;
  onDelete: (value: number) => Promise<void>;
  setIsProcessing: React.Dispatch<React.SetStateAction<Processing>>;
};
export const Footer: React.FC<Props> = ({
  todos,
  sortField,
  setSortField,
  onDelete,
  setIsProcessing,
}) => {
  const someTodosAreDone = todos.some(t => t.completed);
  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  const deleteAllHandle = (items: Todo[]) => {
    const toDelete = items.filter(item => item.completed);

    setIsProcessing(prev => ({
      ...prev,
      deleting: toDelete.map(item => item.id),
    }));

    Promise.all(toDelete.map(item => onDelete(item.id))).finally(() =>
      setIsProcessing(prev => ({ ...prev, deleting: [] })),
    );
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: sortField === SORTFIELD.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSortField(SORTFIELD.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: sortField === SORTFIELD.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSortField(SORTFIELD.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: sortField === SORTFIELD.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSortField(SORTFIELD.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!someTodosAreDone}
        onClick={() => deleteAllHandle(completedTodos)}
      >
        Clear completed
      </button>
    </footer>
  );
};
