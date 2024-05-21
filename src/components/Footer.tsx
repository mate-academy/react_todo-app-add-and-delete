import { Todo } from '../types/Todo';
import { Button } from './Button';
import { Nav } from './Nav';

type Props = {
  activeCount: () => number;
  selected: string;
  selectTodoFilter: (filter: string) => void;
  clearCompleted: () => void;
  todos: Todo[];
};
export const Footer: React.FC<Props> = ({
  activeCount,
  selected,
  selectTodoFilter,
  clearCompleted,
  todos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount()} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <Nav selected={selected} selectTodoFilter={selectTodoFilter} />

      {/* this button should be disabled if there are no completed todos */}

      <Button
        disabled={activeCount() === todos.length}
        type="button"
        className="todoapp__clear-completed"
        dataCy="ClearCompletedButton"
        onClick={() => clearCompleted()}
      >
        Clear completed
      </Button>
    </footer>
  );
};
