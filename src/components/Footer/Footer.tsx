import cn from 'classnames';
import { useAppContext } from '../Context/AppContext';
import { FilterType } from '../../types/FilterType';
import { client } from '../../utils/fetchClient';

export const Footer = () => {
  const {
    todos,
    setTodos,
    filterType,
    setFilterType,
    setIsError,
  } = useAppContext();

  const countOfActiveTodos = todos.filter(todo => !todo.completed).length;
  const countOfCompletedTodos = todos.filter(todo => todo.completed).length;

  const handleClearCompleted = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodosId.forEach((id) => {
      client.delete(`/todos/${id}`)
        .catch(() => {
          setIsError('delete');
        });
    });

    setTodos(todos.filter((todo) => !completedTodosId.includes(todo.id)));
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
            onClick={() => setFilterType('all')}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn('filter__link', {
              selected: filterType === FilterType.active,
            })}
            onClick={() => setFilterType('active')}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn('filter__link', {
              selected: filterType === FilterType.completed,
            })}
            onClick={() => setFilterType('completed')}
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
