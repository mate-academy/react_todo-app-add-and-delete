import classNames from 'classnames';
import { useContext } from 'react';
import { removeTodo } from '../api/todos';
import { TodosContext } from '../stores/TodosContext';
import { ErrorMessages } from '../types/ErrorMessages';
import { FilterParams } from '../types/FilterParams';

export const Footer: React.FC = () => {
  const {
    todos,
    filterBy,
    setFilterBy,
    setTodos,
    setErrorText,
    setHasErrors,
    setIdsToDelete,
  } = useContext(TodosContext);

  const todosCounter = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todosCounter !== todos.length;

  const handleAllClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setFilterBy(FilterParams.All);
  };

  const handleActiveClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setFilterBy(FilterParams.Active);
  };

  const handleCompletedClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setFilterBy(FilterParams.Completed);
  };

  function handleDeleteCompleted() {
    todos.forEach(todo => {
      if (todo.completed) {
        setIdsToDelete(prev => [...prev, todo.id]);
        removeTodo(todo.id)
          .then(() => {
            setTodos(prev => prev.filter(item => item.id !== todo.id));
          })
          .catch(() => {
            setErrorText(ErrorMessages.Delete);
            setHasErrors(true);
          })
          .finally(() => {
          });
      }
    });
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            classNames('filter__link', {
              selected: filterBy === FilterParams.All,
            })
          }
          data-cy="FilterLinkAll"
          onClick={handleAllClick}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            classNames('filter__link', {
              selected: filterBy === FilterParams.Active,
            })
          }
          data-cy="FilterLinkActive"
          onClick={handleActiveClick}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            classNames('filter__link', {
              selected: filterBy === FilterParams.Completed,
            })
          }
          data-cy="FilterLinkCompleted"
          onClick={handleCompletedClick}
        >
          Completed
        </a>
      </nav>

      {!!hasCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleDeleteCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
