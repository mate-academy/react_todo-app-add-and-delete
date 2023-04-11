import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingIds: number[];
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  onDelete,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isLoading={loadingIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          onDelete={onDelete}
        />
      )}

    </section>
  );
};
