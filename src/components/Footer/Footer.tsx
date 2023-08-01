import cn from 'classnames';
import { useAppContext } from '../Context/AppContext';
import { FilterType } from '../../types/FilterType';
import { client } from '../../utils/fetchClient';
import { getTodos } from '../../api/todos';
import { userId } from '../../types/Constants';
import { ErrorTypes } from '../../types/ErrorTypes';

export const Footer = () => {
  const {
    todos,
    setTodos,
    filterType,
    setFilterType,
    setErrorType,
    setProcessing,
  } = useAppContext();

  const countOfActiveTodos = todos.filter(todo => !todo.completed).length;
  const countOfCompletedTodos = todos.filter(todo => todo.completed).length;

  const handleClearCompleted = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessing([...completedTodosId]);

    Promise.all(completedTodosId.map((id) => {
      return client.delete(`/todos/${id}`)
        .catch(() => {
          setErrorType(ErrorTypes.delete);
          setProcessing([]);
        });
    }))
      .then(() => {
        getTodos(userId)
          .then(setTodos)
          .catch(() => {
            setErrorType(ErrorTypes.load);
          })
          .finally(() => {
            setProcessing([]);
          });
      })
      .catch(() => {
        setErrorType(ErrorTypes.delete);
        setProcessing([]);
      });
  };

  return (
    <>
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${countOfActiveTodos} items left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={cn('filter__link', {
              selected: filterType === FilterType.all,
            })}
            onClick={() => setFilterType(FilterType.all)}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn('filter__link', {
              selected: filterType === FilterType.active,
            })}
            onClick={() => setFilterType(FilterType.active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn('filter__link', {
              selected: filterType === FilterType.completed,
            })}
            onClick={() => setFilterType(FilterType.completed)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompleted}
          disabled={countOfCompletedTodos === 0}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
