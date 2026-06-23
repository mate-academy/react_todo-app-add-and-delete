import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  isLoading: boolean;
  deletingId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  isLoading,
  deletingId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={todo.id === deletingId}
          isProcessed
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={() => {}}
          isLoading={isLoading}
          isProcessed
        />
      )}
    </section>
  );
};
