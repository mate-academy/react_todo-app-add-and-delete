import { Todo } from '../types/Types';
import { TodoItem } from './TodoItem';

interface Props {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  onDelete: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  processingIds,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={processingIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};
