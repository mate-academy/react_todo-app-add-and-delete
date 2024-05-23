import { useTodosContext } from '../../context/TodosContext';

import { Status } from '../../types/Status';

type FooterProps = {
  status: Status;
  setStatus: (key: Status) => void;
  deletingTodo: (id: number) => void;
};

export const Footer: React.FunctionComponent<FooterProps> = ({
  status,
  setStatus,
  deletingTodo,
}) => {
  const { todos, setLoadingIds } = useTodosContext();

  const statuses = Object.values(Status);

  const activeTodos = todos.filter(activeTodo => !activeTodo.completed);

  const isClearAllCompletedActive = todos.some(someTodo => someTodo.completed);

  const handleDeleteAllCompleted = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingIds(completedIds);

    completedIds.forEach(id => deletingTodo(id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {statuses.map(filter => (
          <a
            key={filter}
            href={`#/${filter !== 'All' ? filter : ''}`}
            className={`filter__link ${status === filter ? 'selected' : ''}`}
            data-cy={`FilterLink${filter}`}
            onClick={() => setStatus(filter as Status)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteAllCompleted}
        disabled={!isClearAllCompletedActive}
      >
        Clear completed
      </button>
    </footer>
  );
};
