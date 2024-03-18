import { deleteTodos } from '../../api/todos';
import { useTodos } from '../../context/TodosContext';
import { TodoFilter } from '../TodoFilter';

export const Footer: React.FC = () => {
  const { todos, dispatch } = useTodos();

  const uncompletedTodos = todos.filter(todo => !todo.completed).length;
  const isCompletedTodo = todos.some(todo => todo.completed);

  const { handleDeleteTodo, handleSetError } = useTodos();

  const handleDeletingTodo = async (todoId: number) => {
    dispatch({ type: 'todos/setIsDeletingAllCompleted', payload: true });
    try {
      await deleteTodos(todoId);

      handleDeleteTodo(todoId);
    } catch {
      handleSetError('Unable to delete a todo');
    } finally {
      dispatch({ type: 'todos/setIsDeletingAllCompleted', payload: false });
    }
  };

  const handleDeletingAllTodo = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeletingTodo(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodos} items left
      </span>

      <TodoFilter />

      <button
        disabled={!isCompletedTodo}
        onClick={handleDeletingAllTodo}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
