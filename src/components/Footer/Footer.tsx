import cn from 'classnames';
import { useContext } from 'react';
import { TodoContext } from '../../TodoContext';
import { Filter } from '../../types/Filter';
import { deleteTodos } from '../../api/todos';
import { ErrorsType } from '../../types/ErrorsType';

export const Footer = () => {
  const {
    todos,
    filterTodo,
    getFilteredTodo,
    setErrorMessage,
    setHasDelete,
    setSelectedTodos,
  } = useContext(TodoContext);
  const activeTodos = todos.filter(({ completed }) => !completed);
  const isCompleted = todos.some(({ completed }) => completed);
  const isHidden = () => {
    if (!todos.length) {
      return false;
    }

    return true;
  };

  const handleSelectedDelete = async () => {
    const todosToDelete = todos.filter(({ completed }) => completed);

    setSelectedTodos(todosToDelete);

    try {
      const deleteT = todosToDelete.map(({ id }) => deleteTodos(id));

      await Promise.all(deleteT);
      setHasDelete(value => !value);
    } catch {
      setErrorMessage(ErrorsType.Delete);
      setSelectedTodos([]);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <>
      {isHidden() && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${activeTodos.length} items left`}
          </span>

          {/* Active filter should have a 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={cn('filter__link', {
                selected: filterTodo === Filter.All,
              })}
              onClick={() => getFilteredTodo(Filter.All)}
              data-cy="FilterLinkAll"
            >
              All
            </a>

            <a
              href="#/active"
              className={cn('filter__link', {
                selected: filterTodo === Filter.Active,
              })}
              onClick={() => getFilteredTodo(Filter.Active)}
              data-cy="FilterLinkActive"
            >
              Active
            </a>

            <a
              href="#/completed"
              className={cn('filter__link', {
                selected: filterTodo === Filter.Completed,
              })}
              onClick={() => getFilteredTodo(Filter.Completed)}
              data-cy="FilterLinkCompleted"
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className={cn('todoapp__clear-completed', {
              hidden: !isCompleted,
            })}
            onClick={handleSelectedDelete}
            data-cy="ClearCompletedButton"
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
