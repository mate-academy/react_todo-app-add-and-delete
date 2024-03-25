import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  processedId: number;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  processedId,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          processedId={processedId}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem key={tempTodo.id} todo={tempTodo} processedId={processedId} />
      )}
    </section>
  );
};
