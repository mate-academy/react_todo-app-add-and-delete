import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodos } from '../api/todos';
import { showError } from '../helpers/helpers';

interface Props {
  filter: string,
  todos: Todo[]
  setFilter: (text: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setError: React.Dispatch<React.SetStateAction<string>>
  setLoader: React.Dispatch<React.SetStateAction<number[]>>
}

export enum FilterStatus {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const Footer: React.FC<Props> = ({
  filter,
  todos,
  setFilter,
  setTodos,
  setError,
  setLoader,
}) => {
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const clearButtonIsVisible = todos.some(todo => todo.completed);
  const clickHandler = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const activeTodos = todos.filter(todo => !todo.completed);

    completedTodos.forEach(todo => {
      setLoader(prevState => [...prevState, todo.id]);
      deleteTodos(todo.id)
        .then(() => {
          setTodos(activeTodos);
          setLoader([]);
        })
        .catch(() => {
          showError('Unable to delete a todo', setError);
          setLoader([]);
        });
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === FilterStatus.ALL,
          })}
          onClick={() => setFilter(FilterStatus.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === FilterStatus.ACTIVE,
          })}
          onClick={() => setFilter(FilterStatus.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === FilterStatus.COMPLETED,
          })}
          onClick={() => setFilter(FilterStatus.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {clearButtonIsVisible && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={clickHandler}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
