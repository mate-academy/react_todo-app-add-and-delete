import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  filteredTodos: Todo[];
  loadingId: number | null;
  handleDeleteTodo: (id: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  loadingId,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          loadingId={loadingId}
        />
      ))}
    </section>
  );
};
