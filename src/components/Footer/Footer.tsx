import classNames from 'classnames';
import { Status } from '../../utils/helpers';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';
import { errorMessages } from '../../utils/const';
import { RefObject } from 'react';

type Props = {
  todos: Todo[];
  selectedFilter: Status;
  setSelectedFilter: (filter: Status) => void;
  setHasError: (value: boolean) => void;
  setErrorMessage: (message: string) => void;
  setTodos: (update: (todos: Todo[]) => Todo[]) => void;
  inputRef: RefObject<HTMLInputElement>;
};

export const Footer: React.FC<Props> = ({
  todos,
  selectedFilter,
  setSelectedFilter,
  setHasError,
  setErrorMessage,
  setTodos,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodo = todos.filter(todo => todo.completed);

  const deleteAllHandler = () => {
    const completedTodoIds = completedTodo.map(
      completedTodos => completedTodos.id,
    );

    const idsToDelete = completedTodoIds.map(id => deleteTodos(id));

    Promise.allSettled(idsToDelete).then(results => {
      let isError = false;
      const todosIdForDelete: number[] = [];

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          isError = true;
        }

        if (result.status === 'fulfilled') {
          todosIdForDelete.push(completedTodoIds[index]);
        }
      });

      setTodos(() => todos.filter(todo => !todosIdForDelete.includes(todo.id)));
      if (isError) {
        setHasError(true);
        setErrorMessage(errorMessages.deleteError);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === Status.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedFilter(Status.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === Status.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedFilter(Status.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === Status.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedFilter(Status.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodo.length}
        onClick={deleteAllHandler}
      >
        Clear completed
      </button>
    </footer>
  );
};
