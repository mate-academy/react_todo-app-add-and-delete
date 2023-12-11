import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosContext, USER_ID } from '../TodosContext/TodosContext';
import { FilterContext } from '../FilterContext/FilterContext';
import { FilterBy } from '../../types/FilterBy';
import { ErrorMessage } from '../../types/ErrorMessages';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

export const Footer: React.FC = () => {
  const {
    todos, setTodos, handleSetError, setTempUpdating, tempUpdating,
  } = useContext(TodosContext);
  const { filterBy, setFilterBy } = useContext(FilterContext);

  const todosLeft = todos.filter(todo => !todo.completed).length;
  const isActiveClearButton = todos.some(todo => todo.completed);

  const handleDeleteTodo = async (todo: Todo) => {
    handleSetError(ErrorMessage.NOT_ERROR);

    try {
      setTempUpdating([...tempUpdating, todo.id]);
      await deleteTodo(USER_ID, todo.id);
    } catch {
      handleSetError(ErrorMessage.ON_DELETE);
    } finally {
      setTempUpdating([0]);
    }
  };

  const handleClearCompleted = async () => {
    const todosToDelete = todos.filter(todo => todo.completed);

    try {
      todosToDelete.forEach(async (todo) => handleDeleteTodo(todo));
      setTodos(todos.filter(todo => !todo.completed));
    } catch {
      handleSetError(ErrorMessage.ON_DELETE);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy(FilterBy.ALL)}
        >
          All
        </a>

        <a
          href={`#/${FilterBy.ACTIVE}`}
          className={cn('filter__link', {
            selected: filterBy === FilterBy.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy(FilterBy.ACTIVE)}
        >
          Active
        </a>

        <a
          href={`#/${FilterBy.COMPLETED}`}
          className={cn('filter__link', {
            selected: filterBy === FilterBy.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy(FilterBy.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isActiveClearButton}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
