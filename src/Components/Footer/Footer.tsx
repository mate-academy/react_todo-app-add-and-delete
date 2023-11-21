import { deleteTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { TodosFilter } from '../TodosFilter';

type Props = {
  filterStatus: Status,
  setFilterStatus: React.Dispatch<React.SetStateAction<Status>>,
  setError: React.Dispatch<React.SetStateAction<Errors | null>>,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setDeletionId: React.Dispatch<React.SetStateAction<number | null>>,
};

export const Footer: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
  setError,
  todos,
  setTodos,
  setDeletionId,
}) => {
  const completed = todos.filter(todo => todo.completed);
  const active = todos.filter(todo => !todo.completed);

  const handleDelete = () => {
    const completedTodoIds = todos.filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.all(
      completedTodoIds.map(id => deleteTodo(id)
        .then(() => {
          setDeletionId(id);

          return id;
        })
        .catch(() => {
          setError(Errors.DeleteError);

          return null;
        })),
    )
      .then(deletedIds => {
        const remainingTodos = todos.filter(
          todo => !deletedIds.includes(todo.id),
        );

        setTodos(remainingTodos);
      })
      .catch(() => setError(Errors.DeleteError))
      .finally(() => setDeletionId(null));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {active.length}
        {' '}
        items left
      </span>

      <TodosFilter
        setFilterStatus={setFilterStatus}
        filterStatus={filterStatus}
        setError={setError}
      />

      {completed.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleDelete}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
