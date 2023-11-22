import { useContext } from 'react';
import { deleteTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { TodosFilter } from '../TodosFilter';
import { TodosContext } from '../GlobalStateProvier';

export const Footer: React.FC = () => {
  const {
    setError, todos, setTodos, setDeletionId,
  } = useContext(TodosContext);
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
        {`${active.length} items left`}
      </span>

      <TodosFilter />

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
