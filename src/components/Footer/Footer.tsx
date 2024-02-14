import { useContext } from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';
import { deleteTodos } from '../../api/todos';
import { TodoContext } from '../State/TodoContext';

export const Footer: React.FC = () => {
  const {
    todos,
    setTodos,
    setStatus,
    status,
    setIsError,
    setErrorText,
  } = useContext(TodoContext);

  const someTodosToggle = todos.some(todo => todo.completed);
  const notTodosToggle = todos.filter(todo => !todo.completed);
  const itemsLeft = notTodosToggle.length === 1
    ? '1 items left'
    : `${notTodosToggle.length} items left`;

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo => (
      deleteTodos(todo.id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(toDo => toDo.id !== todo.id));
        })
        .catch(() => {
          setIsError(true);
          setErrorText('Unable to delete a todo');
        })
    ));

    Promise.all(deletePromises);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link',
            { selected: status === Status.All })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: status === Status.Active })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: status === Status.Completed })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!someTodosToggle}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
