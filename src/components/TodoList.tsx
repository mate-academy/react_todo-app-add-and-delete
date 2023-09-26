import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  handleDelete: (todoId: number) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos, tempTodo, handleDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos
        .map((todo: Todo) => (
          <TodoItem key={todo.id} todo={todo} handleDelete={handleDelete} />
        ))}
      {tempTodo && (
        <TodoItem
          data-cy="Todo"
          key={tempTodo.id}
          todo={tempTodo}
          handleDelete={handleDelete}
        />
      )}
    </section>
  );
};
