import classNames from 'classnames';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  status: Status;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onChangeStatus: React.Dispatch<React.SetStateAction<Status>>;
  loadingTodoIds: number[];
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const Footer: React.FC<Props> = ({
  todos,
  setTodos,
  status,
  onChangeStatus,
  loadingTodoIds,
  setLoadingTodoIds,
  setErrorMessage,
}) => {
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const activeTodosCount = todos.filter(
    todo => !todo.completed && !loadingTodoIds.includes(todo.id),
  ).length;

  async function handleClearCompleated() {
    const completedTodos = todos.filter(todo => todo.completed);

    setLoadingTodoIds(completedTodos.map(t => t.id));
    setErrorMessage('');

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfulIds = results
      .map((res, index) =>
        res.status === 'fulfilled' ? completedTodos[index].id : null,
      )
      .filter(id => id !== null) as number[];

    const hasErrors = results.some(res => res.status === 'rejected');

    if (hasErrors) {
      setErrorMessage('Unable to delete a todo');
    }

    setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

    setLoadingTodoIds([]);
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === Status.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onChangeStatus(Status.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === Status.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onChangeStatus(Status.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === Status.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onChangeStatus(Status.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={handleClearCompleated}
      >
        Clear completed
      </button>
    </footer>
  );
};
