import { Errors } from '../../types/Errors';

import { TodoItem } from '../Todo/TodoItem';
import * as todoSevice from '../../api/todos';
import { handleRequestError } from '../../utils/handleRequestError';
import { useTodosContext } from '../../utils/useTodosContext';
import { handleFilteredTodos } from '../../utils/handleFiltredTodos';

export const TodoList: React.FC = () => {
  const {
    todos,
    setTodos,
    setError,
    loadingTodoIds,
    setLoadingTodoIds,
    filterSelected,
  } = useTodosContext();
  const preparedTodos = handleFilteredTodos(todos, filterSelected);

  function deleteTodo(todoId: number) {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    setLoadingTodoIds([]);

    todoSevice.deleteTodo(todoId).catch(() => {
      handleRequestError(Errors.deleteTodo, setError);
      setLoadingTodoIds([]);
    });
    setLoadingTodoIds([todoId]);
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          loadingTodoIds={loadingTodoIds}
        />
      ))}
    </section>
  );
};
