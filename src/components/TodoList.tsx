import * as todosService from '../api/todos';
import { errors } from '../constans/Errors';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { FilteredTodos } from '../utils/FilteredTodos';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setError: (error: string | null) => void;
  selectedFilter: Status;
  isSubmitting: boolean;
  setIsSubmitting: (bol: boolean) => void;
  tempTodo: Todo | null;
  loadingTodos: number[];
}
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  setTodos,
  setError,
  selectedFilter,
  isSubmitting,
  tempTodo,
  loadingTodos,
}) => {
  const filteredTodos = FilteredTodos(todos, selectedFilter);

  const deleteTodos = (TodoId: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== TodoId);

    setTodos(updatedTodos);

    return todosService
      .deleteTodos(TodoId)
      .then(() => {})
      .catch(() => {
        setError(errors.delete);
        setTimeout(() => setError(null), 3000);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={deleteTodos}
          isSubmitting={isSubmitting}
          isLoading={loadingTodos.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isSubmitting={isSubmitting}
          isLoading={loadingTodos.includes(0)}
        />
      )}
    </section>
  );
};
