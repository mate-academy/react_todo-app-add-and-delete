import { deleteTodo } from '../../api/todos';
import { Error } from '../../types/Error';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  selectedFilter: Status;
  setSelectedFilter: (filterBy: Status) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  setDeleteIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Footer: React.FC<Props> = ({
  todos,
  selectedFilter,
  setSelectedFilter,
  setTodos,
  setError,
  setDeleteIds,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const clearCompleted = () => {
    const deletePromis = completedTodos.map(todo => {
      setDeleteIds(prevIds => [...prevIds, todo.id]);

      return deleteTodo(todo.id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(item => item.id !== todo.id));
        })
        .catch(() => {
          setError(Error.UnableDelete);
        })
        .finally(() => {
          setDeleteIds(prevIds => prevIds.filter(id => id !== todo.id));
        });
    });

    return deletePromis;
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${selectedFilter === Status.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedFilter(Status.All)}
        >
          All
        </a>
        <a
          href="#/"
          className={`filter__link ${selectedFilter === Status.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedFilter(Status.Active)}
        >
          Active
        </a>
        <a
          href="#/"
          className={`filter__link ${selectedFilter === Status.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedFilter(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => clearCompleted()}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
