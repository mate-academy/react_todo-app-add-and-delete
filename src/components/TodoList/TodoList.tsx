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
    setLoadingTodoIds,
    filterSelected,
    tempTodo,
    setIsloading,
  } = useTodosContext();
  const preparedTodos = handleFilteredTodos(todos, filterSelected);

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

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} deleteTodo={deleteTodo} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} deleteTodo={deleteTodo} />}
    </section>
  );
};
