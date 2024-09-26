import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  todos: Todo[];
  loading: number[];
  temporaryTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  temporaryTodo,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loading}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}
      {temporaryTodo && (
        <TodoItem
          todo={temporaryTodo}
          loading={loading}
          handleDeleteTodo={handleDeleteTodo}
        />
      )}
    </section>
  );
};
