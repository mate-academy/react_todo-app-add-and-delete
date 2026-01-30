import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  onDelete: (id: number) => void;
  processingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  onDelete,
  processingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          isLoading={processingIds.includes(todo.id)}
        />
      ))}
    </section>
  );
};
