import { useContext, useMemo } from 'react';
import classnames from 'classnames';
import { Status } from '../../types/Status';
import { FilterContext } from '../../context/FilterContext';
import { TodoContext } from '../../context/TodoContext';
import { deleteTodo } from '../../api/todos';
import { ErrorContext } from '../../context/ErrorContext';

export const TodoFooter = () => {
  const { todos, setTodos } = useContext(TodoContext);
  const { selectedFilter, setSelectedFilter } = useContext(FilterContext);
  const { setErrorMessage } = useContext(ErrorContext);

  const hasCompletedTodo = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const clearCompleted = () => {
    todos
      .filter(({ completed }) => completed)
      .forEach(({ id }) => {
        deleteTodo(id)
          .then(() => {
            setTodos(prevState => prevState.filter(todo => todo.id !== id));
          })
          .catch(() => setErrorMessage('Unable to delete a todo'));
      });
  };

  return (
    <footer data-cy="Footer" className="todoapp__footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(({ completed }) => !completed).length} items left`}
      </span>

      <nav data-cy="Filter" className="filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classnames(
            'filter__link',
            {
              selected: selectedFilter === Status.All,
            },
          )}
          onClick={() => setSelectedFilter(Status.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classnames(
            'filter__link',
            {
              selected: selectedFilter === Status.Active,
            },
          )}
          onClick={() => setSelectedFilter(Status.Active)}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classnames(
            'filter__link',
            {
              selected: selectedFilter === Status.Completed,
            },
          )}
          onClick={() => setSelectedFilter(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompletedTodo}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
