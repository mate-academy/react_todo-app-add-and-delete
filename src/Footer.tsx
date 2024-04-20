import { Todo } from './types/Todo';
import { Status } from './enums/status';
import cn from 'classnames';
import { deleteTodo } from './api/todos';

type Load = number[] | null;

type Props = {
  setIsLoading: (number: Load) => void;
  setErrMessage: (string: string) => void;
  todos: Todo[];
  isAnyCompleted: boolean;
  stat: Status;
  setTodos: (todos: Todo[]) => void;
  setStat: (x: Status) => void;
};

export const Footer = ({
  setIsLoading,
  setErrMessage,
  todos,
  setTodos,
  isAnyCompleted,
  setStat,
  stat,
}: Props) => {
  const notActive = todos.reduce(
    (acc, todo) => (todo.completed === false ? acc + 1 : acc),
    0,
  );

  const handleDeleteActive = async () => {
    setIsLoading([]);

    try {
      const completedTodos = todos.filter(todo => todo.completed);

      await Promise.all(
        completedTodos.map(todo => {
          setIsLoading((state: number[]) => [...state, todo.id]);
          deleteTodo(todo.id).then(
            setTodos((prevTodos: Todo[]) =>
              prevTodos.filter(prevTodo => !prevTodo.completed),
            ),
          );
        }),
      );
    } catch {
      setErrMessage('An error occurred while deleting completed todos');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notActive} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(status => (
          <a
            key={status}
            href={status === Status.all ? '#/' : `#/${status}`}
            className={cn('filter__link', { selected: stat === status })}
            data-cy={`FilterLink${status}`}
            onClick={() => setStat(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isAnyCompleted}
        onClick={handleDeleteActive}
      >
        Clear completed
      </button>
    </footer>
  );
};
