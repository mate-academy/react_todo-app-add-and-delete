import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  isLoading: boolean;
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  isDeleting: number[];
};

export const TodoList: React.FC<Props> = ({
  visibleTodos, isLoading, tempTodo, onDelete, isDeleting,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoading}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={isLoading}
        />
      )}
    </section>
  );
};
