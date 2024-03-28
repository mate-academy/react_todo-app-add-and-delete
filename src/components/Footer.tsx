import { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { SetTodosContext, TodosContext } from '../Contexts/TodosContext';
import { deleteTodos } from '../api/todos';
import { Filter } from '../types/Filter';
import { SetInputRef } from '../Contexts/InputRefContext';
import { SetErrorContext } from '../Contexts/ErrorContext';
import { ErrorMessage } from '../types/Error';
import { SetIsDeletingContext } from '../Contexts/DeletingContext';

type Props = {
  setFilter: (newFilter: Filter) => void;
  filter: Filter;
};

export const Footer: React.FC<Props> = ({ setFilter, filter }) => {
  const todos = useContext(TodosContext);
  const setTodos = useContext(SetTodosContext);
  const setInputFocused = useContext(SetInputRef);
  const setErrorMessage = useContext(SetErrorContext);
  const setIsDeleting = useContext(SetIsDeletingContext);

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  const handleClearCompleted = useCallback(() => {
    setIsDeleting(true);
    const todosToDelete = todos.filter(todo => todo.completed);

    Promise.allSettled(
      todosToDelete.map(async todo => {
        try {
          await deleteTodos(todo.id);
          setTodos(prevTodos => {
            return prevTodos.filter(prevTodo => prevTodo.id !== todo.id);
          });
        } catch {
          setErrorMessage(ErrorMessage.delete);
        }
      }),
    ).finally(() => {
      setInputFocused(true);
      setIsDeleting(false);
    });
  }, [setErrorMessage, setInputFocused, setTodos, todos, setIsDeleting]);

  const handleFiltration = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFiltration(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFiltration(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFiltration(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
