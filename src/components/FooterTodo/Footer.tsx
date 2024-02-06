import classNames from 'classnames';
import { useContext, useMemo } from 'react';
import { ContextTodo } from '../ContextTodo';
import { TodoFilter, ErrorMessage } from '../../types';
import { deleteTodo } from '../../api/todos';

export const FooterTodo = () => {
  const {
    filterBy,
    setFilterBy,
    todos,
    setTodos,
    setUpdatedTodos,
    setErrorMessage,
  } = useContext(ContextTodo);

  const toDeleteTodos = todos.filter(todo => todo.completed);

  const removeCompletedTodos = () => {
    setUpdatedTodos(toDeleteTodos);

    toDeleteTodos.map(deletedTodo => deleteTodo(deletedTodo.id)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(currentTodo => currentTodo.id !== deletedTodo.id)))
      .catch(() => setErrorMessage(ErrorMessage.DeleteTodoError))
      .finally(() => setUpdatedTodos([])));
  };

  const todosLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link',
            {
              selected: filterBy === TodoFilter.All,
            })}
          onClick={() => setFilterBy(TodoFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            {
              selected: filterBy === TodoFilter.Active,
            })}
          onClick={() => setFilterBy(TodoFilter.Active)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link',
            {
              selected: filterBy === TodoFilter.Completed,
            })}
          onClick={() => setFilterBy(TodoFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={removeCompletedTodos}
        disabled={todosLeft === todos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
