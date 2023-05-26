import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todoList: Todo[];
  tempTodo: Todo | null;
  deletingId: number | null;
  onDelete: (id: number) => void;
};

export const TodoAppContent: React.FC<Props> = ({
  todoList,
  tempTodo,
  deletingId,
  onDelete,
}) => {
  return (
    <section className="todoapp__main">
      {todoList.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deletingId={deletingId}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deletingId={deletingId}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
