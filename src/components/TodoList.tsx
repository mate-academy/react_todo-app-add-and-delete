// import * as todosService from '../api/todos';
// import { errors } from '../constans/Errors';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { FilteredTodos } from '../utils/FilteredTodos';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  selectedFilter: Status;
  isSubmitting: boolean;
  setIsSubmitting: (bol: boolean) => void;
  tempTodo: Todo | null;
  loadingTodos: number[];
  onDelete: (postId: number) => void;
}
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  selectedFilter,
  isSubmitting,
  tempTodo,
  loadingTodos,
  onDelete,
}) => {
  const filteredTodos = FilteredTodos(todos, selectedFilter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
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
