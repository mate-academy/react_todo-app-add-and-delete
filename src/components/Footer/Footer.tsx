import classNames from 'classnames';
import { useContext, useMemo } from 'react';
import { TodosContext } from '../../contexts/TodosContext';
import { deleteTodo } from '../../api/todos';
import { Status } from '../../types/Status';

export const Footer = () => {
  const {
    filterBy,
    setFilterBy,
    todos,
    setTodos,
    setUpdatedTodos,
    setErrorMessage,
  } = useContext(TodosContext);

  const toDeleteTodos = todos.filter(todo => todo.completed);

  const removeCompletedTodos = () => {
    setUpdatedTodos(toDeleteTodos);

    toDeleteTodos.map(deletedTodo => deleteTodo(+deletedTodo.id)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(currentTodo => currentTodo.id !== deletedTodo.id)))
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setUpdatedTodos([])));
  };

  const todosLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          onClick={() => setFilterBy(Status.All)}
          className={classNames('filter__link', {
            selected: filterBy === 'All',
          })}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          onClick={() => setFilterBy(Status.Active)}
          className={classNames('filter__link', {
            selected: filterBy === 'Active',
          })}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          onClick={() => setFilterBy(Status.Completed)}
          className={classNames('filter__link', {
            selected: filterBy === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        onClick={removeCompletedTodos}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosLeft === todos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
