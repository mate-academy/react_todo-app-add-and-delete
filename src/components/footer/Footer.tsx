import { Todo } from '../../types/Todo';
import { Filter } from '../filter/Filter';

type Props = {
  filter: (query: string) => void;
  unCompletedCount: number | undefined;
  completed: Todo[];
  deleteAll: (postId: number) => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  unCompletedCount,
  completed,
  deleteAll,
}) => {
  const deletePosts = () => {
    return completed.map(todo => deleteAll(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {unCompletedCount} items left
      </span>

      <Filter filter={filter} />

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completed.length}
        onClick={deletePosts}
      >
        Clear completed
      </button>
    </footer>
  );
};
