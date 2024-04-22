import { Status } from './enums/status';
import cn from 'classnames';
import { useContext } from 'react';
import { ContextTodos } from './TodoContext';

type Props = {
  isAnyCompleted: boolean;
};

export const Footer = ({ isAnyCompleted }: Props) => {
  const { todos, removeTodo, setErrMessage, setIsLoading, stat, setStat } =
    useContext(ContextTodos);
  const notActive = todos.reduce(
    (acc, todo) => (todo.completed === false ? acc + 1 : acc),
    0,
  );

  const handleDeleteActive = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed);

      for (const todo of completedTodos) {
        await removeTodo(todo);
      }
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
