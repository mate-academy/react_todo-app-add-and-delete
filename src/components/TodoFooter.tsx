import { CompletionStatus } from '../types/CompletionStatus';
import { RemoveTodo } from '../utils/removeTodo';
import { useTodosContext } from '../TodoContext';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
};

export const TodoFooter: React.FC<Props> = ({ todos }) => {
  const {
    filterByStatus,
    itemsLeft,
    setFilterByStatus,
    setTodos,
    setLoadingItemsIds,
    handleError,
  } = useTodosContext();

  const completedTodos = todos.filter(todo => todo.completed);

  const handleClearCompletedTodos = () => {
    completedTodos.forEach(completedTodo => {
      const deletedId = completedTodo.id;

      RemoveTodo({ deletedId, setTodos, setLoadingItemsIds, handleError });
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(CompletionStatus).map(status => (
          <a
            data-cy={`FilterLink${status}`}
            key={CompletionStatus[status]}
            href="#/"
            className={classNames('filter__link', {
              selected: filterByStatus === CompletionStatus[status],
            })}
            onClick={() => setFilterByStatus(CompletionStatus[status])}
          >
            {CompletionStatus[status]}
          </a>
        ))}
      </nav>

      <button
        type="button"
        data-cy="ClearCompletedButton"
        className="todoapp__clear-completed"
        disabled={!completedTodos.length}
        onClick={handleClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
