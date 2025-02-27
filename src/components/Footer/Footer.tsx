import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import classNames from 'classnames';
import { Filter } from '../../App';

interface Props {
  todos: Todo[];
  filter: string;
  setIsDelete: (value: boolean) => void;
  setFilter: (filter: Filter) => void;
  setDeletedId: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setIsDelete,
  setFilter,
  setTodos,
  setErrorMessage,
  setDeletedId,
}) => {
  const qtyCompleted = todos.filter(todo => todo.completed).length;

  const handleDeleteTodos = async () => {
    setIsDelete(true);

    const completedTodos = todos.filter(todo => todo.completed);
    const deletedId = completedTodos.map(todo => todo.id);

    setDeletedId(deletedId);

    try {
      await Promise.all(
        completedTodos.map(async todo => {
          try {
            await deleteTodo(todo.id);
            setDeletedId((prevIds: number[]) => [...prevIds, todo.id]);
            setTodos(prevTodos =>
              prevTodos.filter(prevTodo => prevTodo.id !== todo.id),
            );
          } catch {
            setErrorMessage('Unable to delete a todo');
          } finally {
            setIsDelete(false);
            setDeletedId(prevIds => prevIds.filter(id => id !== todo.id));
          }
        }),
      );
    } finally {
      setIsDelete(false);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.length - qtyCompleted} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(currentFilter => (
          <a
            href={`#/${currentFilter}`}
            className={classNames('filter__link', {
              selected: filter === currentFilter,
            })}
            data-cy={`FilterLink${currentFilter}`}
            onClick={() => setFilter(currentFilter)}
            key={currentFilter}
          >
            {currentFilter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={qtyCompleted === 0}
        onClick={handleDeleteTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
