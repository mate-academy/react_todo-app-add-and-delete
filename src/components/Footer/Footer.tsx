import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { Navigation } from '../Navigation/Navigation';

type Props = {
  todos: Todo[];
  filterBy: string;
  setFilterBy: (filterBy: Filter) => void;
  onDelete: () => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  onDelete,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const comletedTodos = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <Navigation
        filterBy={filterBy}
        setFilterBy={setFilterBy}
      />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={onDelete}
      >
        {comletedTodos.length ? 'Clear completed' : ''}
      </button>

    </footer>
  );
};
