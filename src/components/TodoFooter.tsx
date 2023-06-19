import cn from 'classnames';
import { useContext } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { SetErrorContext } from '../utils/setErrorContext';
import { ErrorMessage } from '../utils/ErrorMessage';
import { FilteringMode } from '../utils/FilteringMode';

interface Props {
  setFilteringMode: (arg0: FilteringMode) => void,
  filteringMode: FilteringMode;
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setTodosToBeDeleted: React.Dispatch<React.SetStateAction<number[] | null>>,
}

export const TodoFooter: React.FC<Props>
  = ({
    setFilteringMode, filteringMode, todos, setTodosToBeDeleted, setTodos,
  }) => {
    const setError = useContext(SetErrorContext);

    const handleMassDeletion = () => {
      const completedTodos = todos.filter(todo => todo.completed);

      setTodosToBeDeleted(completedTodos.map(todo => todo.id));

      Promise.all(completedTodos.map((todo) => {
        return new Promise((resolve) => deleteTodo(todo.id)
          .then(resolve))
          .catch(() => {
            setTodosToBeDeleted([]);
            setError?.(ErrorMessage.CantDelete);
          });
      }))
        .then(() => {
          setTodosToBeDeleted([]);
          setTodos(todos.filter(todo => !todo.completed));
        });
    };

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          3 items left
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={cn({
              filter__link: true,
              selected: filteringMode === FilteringMode.all,
            })}
            onClick={() => setFilteringMode(FilteringMode.all)}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn({
              filter__link: true,
              selected: filteringMode === FilteringMode.active,
            })}
            onClick={() => setFilteringMode(FilteringMode.active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn({
              filter__link: true,
              selected: filteringMode === FilteringMode.completed,
            })}
            onClick={() => setFilteringMode(FilteringMode.completed)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className={cn({
            'todoapp__clear-completed': true,
            'todoapp__clear-completed__hidden':
              !todos.find(todo => todo.completed),
          })}
          onClick={handleMassDeletion}
        >
          Clear completed
        </button>
      </footer>
    );
  };
