import { deleteTodo } from '../../api/todos';
import { ErrorType, Status } from '../../types';
import { Todo } from '../../types';

type Props = {
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  processingId: number | null;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Footer: React.FC<Props> = ({
  status,
  setStatus,
  todos,
  setTodos,
  processingId,
  setError,
  inputRef,
}) => {
  const itensLeft = todos.filter(
    todo => !todo.completed && todo.id !== processingId,
  ).length;

  const hasCompleted = todos.some(todo => todo.completed);

  const deleteCompleted = async () => {
    const completed = todos.filter(todo => todo.completed);

    const successfullyDeletedIds: number[] = [];

    for (const todo of completed) {
      try {
        await deleteTodo(todo.id);
        successfullyDeletedIds.push(todo.id); // só marca como deletado se a API deu certo
      } catch {
        setError('delete');
      }
    }

    setTodos(prev =>
      prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );

    inputRef.current?.focus();
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itensLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className={'filter'} data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${status === 'All' ? 'selected' : ''} `}
          data-cy="FilterLinkAll"
          onClick={() => setStatus('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${status === 'Active' ? 'selected' : ''} `}
          data-cy="FilterLinkActive"
          onClick={() => setStatus('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${status === 'Completed' ? 'selected' : ''} `}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus('Completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={async () => {
          setStatus('All');
          await deleteCompleted();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
