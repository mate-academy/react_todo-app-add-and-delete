import { Todo } from './types/Todo';
import { Status } from './enums/status';
import cn from 'classnames';

type Props = {
  setErrMessage: (string: string) => void;
  todos: Todo[];
  isAnyCompleted: boolean;
  stat: Status;
  removeTodo: (todo: Todo) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setStat: (x: Status) => void;
};

export const Footer = ({
  removeTodo,
  setIsLoading,
  setErrMessage,
  todos,
  isAnyCompleted,
  setStat,
  stat,
}: Props) => {
  const notActive = todos.reduce(
    (acc, todo) => (todo.completed === false ? acc + 1 : acc),
    0,
  );

  const handleDeleteActive = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed);

      completedTodos.map(todo => {
        removeTodo(todo);

        // setIsLoading(state => [...state, todo.id]);

        // deleteTodo(todo.id).then(() =>
        //   setTodos(prevTodos =>
        //     prevTodos.filter(prevTodo => !prevTodo.completed),
        //   ),
        // );
      });
    } catch {
      setErrMessage('An error occurred while deleting completed todos');
    } finally {
      setIsLoading([]);
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
