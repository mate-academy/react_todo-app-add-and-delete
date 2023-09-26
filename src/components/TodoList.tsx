import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  isTempTodoLoading: boolean;
  handleDelete: (todoId: number) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos, tempTodo, isLoading, isTempTodoLoading, handleDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos
        .map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={isLoading}
            handleDelete={handleDelete}
          />
        ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={isTempTodoLoading}
          handleDelete={handleDelete}
        />
      )}
    </section>
  );
};
