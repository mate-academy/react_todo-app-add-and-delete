import classNames from 'classnames';
import { useTodos } from '../../context/todoProvider';
import { deleteTodo } from '../../api/todos';
import { ErrorType } from '../../types/Error';

export const TodoFooter = () => {
  const {
    filterBy, setFilterBy, countIncompleteTask, todos,
    setTodos, setError, setDeletingTask,
  } = useTodos();

  const hiddenBtn = todos.filter(el => el.completed).length === 0;

  const deleteCompletedTask = () => {
    setError(null);
    const unCompletedTodos = todos.filter(task => !task.completed);

    const compeledTask = todos.filter(task => task.completed);

    const currentDeleting = compeledTask.map(task => task.id);

    compeledTask.forEach(task => {
      currentDeleting.push(task.id);

      return setDeletingTask(currentDeleting);
    });

    Promise.allSettled(compeledTask.map(task => deleteTodo(task.id)))
      .catch(() => setError(ErrorType.delete))
      .finally(() => {
        setTodos(unCompletedTodos);
        setDeletingTask([]);
      });
  };

  if (todos.length <= 0) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countIncompleteTask}
        {' '}
        items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompletedTask}
        disabled={hiddenBtn}
      >
        Clear completed
      </button>
    </footer>
  );
};
