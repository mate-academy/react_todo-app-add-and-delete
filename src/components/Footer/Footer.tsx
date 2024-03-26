import { useTodosContext } from '../../utils/useTodosContext';
import { TodoFilter } from '../TodoFilter';
import * as todoSevice from '../../api/todos';
import { handleRequestError } from '../../utils/handleRequestError';
import { Errors } from '../../types/Errors';

export const Footer: React.FC = () => {
  const {
    todos,
    setTodos,
    activeTodos,
    completedTodos,
    setLoadingTodoIds,
    setIsloading,
    setError,
  } = useTodosContext();

  function deleteTodo(todoId: number) {
    setLoadingTodoIds([todoId]);

    todoSevice
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setIsloading(true);
      })
      .catch(() => {
        handleRequestError(Errors.deleteTodo, setError);
        setLoadingTodoIds([]);
        setIsloading(true);
      });
    setLoadingTodoIds([todoId]);
  }

  const handleDeleteCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  return (
    <div>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodos.length} items left
        </span>
        <TodoFilter />

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={completedTodos.length < 1}
          onClick={handleDeleteCompleted}
        >
          Clear completed
        </button>
      </footer>
    </div>
  );
};
