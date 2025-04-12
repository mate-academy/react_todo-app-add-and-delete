import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../App';
import { deleteTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  selectedNav: Filter;
  handelFilter: (e: React.MouseEvent) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  setActiveTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  isLoading: boolean;
};

type FilterNavProps = {
  selectedNav: Filter;
  handelFilter: (e: React.MouseEvent) => void;
};

const FilterNav: React.FC<FilterNavProps> = ({ selectedNav, handelFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Filter).map(filter => (
        <a
          key={filter}
          href={`#${filter}`}
          className={classNames('filter__link', {
            selected: selectedNav === filter,
          })}
          data-cy={`FilterLink${filter}`}
          onClick={handelFilter}
        >
          {filter}
        </a>
      ))}
    </nav>
  );
};

const Footer = ({
  todos,
  selectedNav,
  handelFilter,
  setTodos,
  setError,
  inputRef,
  setActiveTodoIds,
}: Props) => {
  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setActiveTodoIds(completedTodos.map(todo => todo.id));

    completedTodos.forEach(completedTodo => {
      deleteTodo(completedTodo.id)
        .then(() => {
          setTodos(currentTodos => {
            return currentTodos.filter(
              currentTodo => currentTodo.id !== completedTodo.id,
            );
          });
          setActiveTodoIds(current =>
            current.filter(id => id !== completedTodo.id),
          );
        })
        .catch(() => {
          setError('Unable to delete a todo');
          setActiveTodoIds(current =>
            current.filter(id => id !== completedTodo.id),
          );
        });
    });

    inputRef.current?.focus();
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <FilterNav selectedNav={selectedNav} handelFilter={handelFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
