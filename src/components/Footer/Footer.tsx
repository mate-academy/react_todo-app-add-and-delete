import classNames from 'classnames';
import { FilterTypes } from '../../types/FilterTypes';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  notCompletedTodosCount: number;
  selectedTodos: FilterTypes;
  setSelectedTodos: (filterType: FilterTypes) => void;
  isAnyCompletedTodos: boolean;
  setIsDeletedTodoHasLoader: (state: boolean) => void;
  completedIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsErrorHidden: (state: boolean) => void;
  setIsDeletedRequestHasError: (state: boolean) => void;
};

export const Footer: React.FC<Props> = ({
  notCompletedTodosCount,
  selectedTodos,
  setSelectedTodos,
  isAnyCompletedTodos,
  setIsDeletedTodoHasLoader,
  completedIds,
  setTodos,
  setIsErrorHidden,
  setIsDeletedRequestHasError,
}) => {
  function handleDeleteCompletedTodos() {
    setIsDeletedTodoHasLoader(true);

    Promise.allSettled(completedIds.map(id => deleteTodo(id)))
      .then(results => {
        const successfulIds = results
          .map((result, index) =>
            result.status === 'fulfilled' ? completedIds[index] : null,
          )
          .filter(id => id !== null);

        setTodos(currTodos =>
          currTodos.filter(todo => !successfulIds.includes(todo.id)),
        );

        if (results.some(result => result.status === 'rejected')) {
          setIsErrorHidden(false);
          setIsDeletedRequestHasError(true);
          setTimeout(() => {
            setIsErrorHidden(true);
            setIsDeletedRequestHasError(false);
          }, 3000);
        }
      })
      .finally(() => {
        setIsDeletedTodoHasLoader(false);
      });
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(FilterTypes).map(filterType => (
          <a
            href={filterType[0] === 'All' ? `#/` : `#/${filterType[0]}`}
            className={classNames('filter__link', {
              selected: selectedTodos === filterType[1],
            })}
            data-cy={`FilterLink${filterType[0]}`}
            onClick={() => {
              if (selectedTodos !== filterType[0]) {
                setSelectedTodos(filterType[1]);
              }
            }}
            key={filterType[0]}
          >
            {filterType[0]}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompletedTodos}
        disabled={isAnyCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
