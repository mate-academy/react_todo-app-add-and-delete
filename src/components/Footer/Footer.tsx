import { deleteTodo } from '../../api/todos';
import { Errors } from '../../enums/Errors';
import { useTodosContext } from '../../hooks/useTodosContext';
import { TodoFilter } from '../TodoFilter';

export const Footer: React.FC = () => {
  const { todos, setTodos, setLoadingTodoIds, showError, setIsFocusedInput } =
    useTodosContext();

  const notCompletedCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - notCompletedCount;

  const handleDeleteTodo = async (todoId: number): Promise<void> => {
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(t => t.id !== todoId));
      setLoadingTodoIds([]);
    } catch (err) {
      showError(Errors.DeleteTodo);
      setLoadingTodoIds([]);
    }
  };

  const deleteCompletedTodos = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingTodoIds(completedTodoIds);

    const deletePromises = completedTodoIds.map(todoId =>
      handleDeleteTodo(todoId),
    );

    Promise.all(deletePromises)
      .then(() => setIsFocusedInput(true))
      .catch(() => showError(Errors.DeleteTodo));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${notCompletedCount} items left`}
      </span>

      <TodoFilter />

      <button
        type="button"
        disabled={completedCount < 1}
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
