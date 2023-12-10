import { TodoFilter } from './TodoFilter';
import { deleteTodo } from './api/todos';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';

type Props = {
  setFilter: (filter: Filter) => void;
  todos: Todo[];
  filter: Filter;
  setTodos: (todo: Todo[]) => void;
  userId: number;
  setErrorMessage: (err: string) => void;
  clearCompleted: boolean;
  setClearCompleted: (con: boolean) => void;
};

export const Footer: React.FC<Props> = ({
  setFilter,
  todos,
  filter,
  setTodos,
  userId,
  setErrorMessage,
  clearCompleted,
  setClearCompleted,
}) => {
  const notCompletedCount = todos.filter((el) => !el.completed).length;
  const completedCount = todos.filter((el) => el.completed).length;

  const getCompletedTodos = () => {
    return todos.filter((todo) => todo.completed);
  };

  const handleClearCompleted = async () => {
    setClearCompleted(true);
    const completedTodos = getCompletedTodos();

    try {
      // eslint-disable-next-line max-len
      const deletionPromises = completedTodos.map((todo) => deleteTodo(userId, todo.id)
        .then(() => todo.id)
        .catch(() => null));

      const deletedTodoIds = await Promise.all(deletionPromises);

      const updatedTodos = todos.filter(
        (todo) => !deletedTodoIds.includes(todo.id),
      );

      setTodos(updatedTodos);
    } catch (error) {
      setErrorMessage('Error deleting completed todos');
    } finally {
      setClearCompleted(false);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${notCompletedCount} ${
          notCompletedCount === 1 ? 'item' : 'items'
        } left`}
      </span>
      <TodoFilter setFilter={setFilter} filter={filter} />
      {!!completedCount && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
          disabled={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
