import classNames from 'classnames';
import { useContext, useMemo } from 'react';
import { Status } from '../../types/Status';
import { TodoContext } from '../TodoContext';
import { deleteTodo } from '../../api/todos';
import { ErrorContext } from '../ErrorContext';

type Props = {
  status: Status;
  onStatusChange: (status: Status) => void;
  onGlobalLoaderChange: (globalLoader: boolean) => void;
};

export const TodoFooter: React.FC<Props> = (props) => {
  const {
    status,
    onStatusChange,
    onGlobalLoaderChange,
  } = props;

  const { todos, setTodos } = useContext(TodoContext);
  const { setError } = useContext(ErrorContext);

  const uncomplitedTodos = useMemo(() => todos
    .filter(({ completed }) => !completed), [todos]);

  const handleComplDelete = () => {
    onGlobalLoaderChange(true);

    const deletedTodos: Promise<number>[] = [];

    todos.forEach(({ id, completed }) => {
      if (completed) {
        deletedTodos.push(deleteTodo(id)
          .then(() => id)
          .catch(error => {
            throw error;
          }));
      }
    });

    Promise.all(deletedTodos)
      .then((res) => {
        setTodos(prevState => prevState
          .filter(todo => !res.includes(todo.id)));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => onGlobalLoaderChange(false));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${uncomplitedTodos.length} item${uncomplitedTodos.length === 1 ? '' : 's'} left`}
      </span>

      <nav className="filter">
        {Object.keys(Status).map((key) => {
          const value = Status[key as keyof typeof Status];

          return (
            <a
              key={key}
              href={`#/${value}`}
              className={classNames('filter__link', {
                selected: value === status,
              })}
              onClick={() => onStatusChange(value)}
            >
              {key}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={uncomplitedTodos.length === todos.length}
        onClick={handleComplDelete}
      >
        Clear completed
      </button>

    </footer>
  );
};
