import { Filter } from '../Filter/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  count: number;
  completed: Todo[];
  handleDelete: (id: number[]) => void;
};

export const Footer: React.FC<Props> = ({ count, completed, handleDelete }) => {
  const completedIds = completed.map(todo => todo.id);

  return (
    // {/* Hide the footer if there are no todos */}
    <footer className={`todoapp__footer`} data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {count} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <Filter />

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!(completed.length > 0)}
        onClick={() => handleDelete(completedIds)}
      >
        Clear completed
      </button>
    </footer>
  );
};
