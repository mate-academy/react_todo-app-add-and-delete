import classNames from 'classnames';
import {
  TodoStatusOption,
  TodoStatusOptions,
  todoStatusOptions,
} from '../../types/TodoStatusOption';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { StateSetter } from '../../types/StateSetter';

interface Props {
  allTodos: Todo[];
  setTodos: StateSetter<Todo[]>;
  currentFilter: TodoStatusOption;
  setError: (msg: string, timeout?: number) => void;
}

export const Footer: React.FC<Props> = ({
  allTodos,
  setTodos,
  currentFilter,
  setError,
}) => {
  const activeTodos: Todo[] = [];
  const completedTodos: Todo[] = [];

  allTodos.forEach(todo => {
    if (todo.completed) {
      completedTodos.push(todo);
    } else {
      activeTodos.push(todo);
    }
  });

  const handleCleanup = async () => {
    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id).then(() => todo.id)),
    );

    const successfulDeletes = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    const hasError = completedTodos.length !== successfulDeletes.length;

    if (hasError) {
      setError('Unable to delete a todo');
    }

    setTodos(current =>
      current.filter(todo => !successfulDeletes.includes(todo.id)),
    );
  };

  return (
    <footer
      className={classNames('todoapp__footer', { hidden: !!allTodos })}
      data-cy="Footer"
    >
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {todoStatusOptions.map(option => {
          const capitalizedOption =
            option.charAt(0).toUpperCase() + option.slice(1);
          const urlSuffix = option === TodoStatusOptions.ALL ? '' : option;

          return (
            <a
              href={`#/${urlSuffix}`}
              className={classNames('filter__link', {
                selected: currentFilter === option,
              })}
              data-cy={`FilterLink${capitalizedOption}`}
              key={option}
            >
              {capitalizedOption}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleCleanup}
      >
        Clear completed
      </button>
    </footer>
  );
};
