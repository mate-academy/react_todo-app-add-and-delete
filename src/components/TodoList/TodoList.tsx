import type { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (id: number) => void;
  processingIds: number[];
};

export const TodoList = ({
  todos,
  tempTodo,
  onDeleteTodo,
  processingIds,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={processingIds.includes(todo.id)}
          onDelete={onDeleteTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem todo={tempTodo} isLoading={true} onDelete={onDeleteTodo} />
      )}
    </section>
  );
};
