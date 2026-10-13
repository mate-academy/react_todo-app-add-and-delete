import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  tempTodo: Todo | null;
  todos: Todo[];
  onDelete: (id: number) => void;
  deletingIds: number[];
};

export const TodoList: React.FC<TodoListProps> = ({
  onDelete,
  deletingIds,
  tempTodo,
  todos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={deletingIds.includes(todo.id)}
          onDelete={() => onDelete(todo.id)}
        />
      ))}
      {tempTodo && <TodoItem isLoading todo={tempTodo} />}
    </section>
  );
};
