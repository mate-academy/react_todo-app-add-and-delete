/* eslint-disable @typescript-eslint/no-unused-expressions */
import { deleteTodo } from '../../api/todos';
import { SortType } from '../../types/SortType';
import { Todo } from '../../types/Todo';

type Props = {
  setSortType: (value: SortType) => void,
  todos: Todo[],
  setIsRemoving: (value: boolean) => void,
  completedTodosIds: number [],
  setIsError: (value: string | null) => void,
};

export const TodoFooter: React.FC<Props> = ({
  setSortType,
  todos,
  setIsRemoving,
  completedTodosIds,
  setIsError,
}) => {
  const todosLength = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className="filter__link selected"
          onClick={() => {
            setSortType(SortType.ALL);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className="filter__link"
          onClick={() => {
            setSortType(SortType.ACTIVE);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className="filter__link"
          onClick={() => {
            setSortType(SortType.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      {completedTodosIds.length > 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => {
            setIsRemoving(true);
            completedTodosIds.map(todo => {
              return (
                deleteTodo(todo)
                  .then(() => setIsRemoving(false))
                  .catch(error => {
                    setIsError(`${error}: Unable to delete a todos`);
                    setIsRemoving(false);
                  })
              );
            });
          }}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
