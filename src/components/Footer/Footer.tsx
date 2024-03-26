import { Todo } from '../../types/Todo';
import { TodoFilter } from '../TodoFilter';

type Props = {
  activeTodos: Todo[];
  completedTodos: Todo[];
};

export const Footer: React.FC<Props> = ({ activeTodos, completedTodos }) => {
  return (
    <div>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodos.length} items left
        </span>
        <TodoFilter />

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={completedTodos.length < 1}
        >
          Clear completed
        </button>
      </footer>
    </div>
  );
};
